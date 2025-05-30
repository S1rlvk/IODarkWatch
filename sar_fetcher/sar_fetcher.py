#!/usr/bin/env python3

import argparse
import logging
import os
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Tuple, Optional

import click
import pandas as pd
from dateutil.relativedelta import relativedelta
from sentinelhub import (
    CRS,
    BBox,
    DataCollection,
    MimeType,
    SentinelHubRequest,
    SHConfig,
    bbox_to_dimensions,
)
from tqdm import tqdm

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def parse_bbox(bbox_str: str) -> Tuple[float, float, float, float]:
    """Parse bbox string into tuple of coordinates."""
    try:
        lon_min, lat_min, lon_max, lat_max = map(float, bbox_str.split(','))
        return lon_min, lat_min, lon_max, lat_max
    except ValueError as e:
        raise click.BadParameter(f"Invalid bbox format. Expected: lon_min,lat_min,lon_max,lat_max. Error: {e}")

def create_grid(bbox: Tuple[float, float, float, float], grid_size: float) -> List[Tuple[float, float, float, float]]:
    """Create grid of bboxes with given size in degrees."""
    lon_min, lat_min, lon_max, lat_max = bbox
    grid_cells = []
    
    lon = lon_min
    while lon < lon_max:
        lat = lat_min
        while lat < lat_max:
            grid_cells.append((
                lon,
                lat,
                min(lon + grid_size, lon_max),
                min(lat + grid_size, lat_max)
            ))
            lat += grid_size
        lon += grid_size
    
    return grid_cells

def get_monthly_dates(start_date: datetime, end_date: datetime) -> List[Tuple[datetime, datetime]]:
    """Get list of (start, end) dates for each month in range."""
    dates = []
    current = start_date.replace(day=1)
    
    while current <= end_date:
        next_month = current + relativedelta(months=1)
        dates.append((current, next_month - timedelta(days=1)))
        current = next_month
    
    return dates

def download_sar_image(
    bbox: Tuple[float, float, float, float],
    start_date: datetime,
    end_date: datetime,
    output_dir: Path,
    config: SHConfig,
    max_retries: int = 3
) -> Optional[dict]:
    """Download SAR image for given bbox and time period."""
    lon_min, lat_min, lon_max, lat_max = bbox
    bbox_obj = BBox(bbox=bbox, crs=CRS.WGS84)
    size = bbox_to_dimensions(bbox_obj, resolution=10)
    
    request = SentinelHubRequest(
        data_collection=DataCollection.SENTINEL1_IW_GRD,
        bands=['VV'],
        bbox=bbox_obj,
        time=(start_date, end_date),
        size=size,
        config=config,
        mime_type=MimeType.TIFF,
        maxcc=1.0
    )
    
    for attempt in range(max_retries):
        try:
            data = request.get_data()
            if not data:
                logger.warning(f"No data found for bbox {bbox} and time {start_date} to {end_date}")
                return None
            
            # Create output directory structure
            year_dir = output_dir / str(start_date.year)
            month_dir = year_dir / f"{start_date.month:02d}"
            month_dir.mkdir(parents=True, exist_ok=True)
            
            # Save image
            filename = f"{lat_min:.2f}_{lon_min:.2f}.tif"
            output_path = month_dir / filename
            data[0].save(output_path)
            
            return {
                'tile': f"{lat_min:.2f}_{lon_min:.2f}",
                'timestamp': start_date.strftime('%Y-%m-%d'),
                'cloud_cover': None,  # Not available for SAR
                'file_path': str(output_path.relative_to(output_dir))
            }
            
        except Exception as e:
            if attempt == max_retries - 1:
                logger.error(f"Failed to download after {max_retries} attempts: {e}")
                return None
            logger.warning(f"Attempt {attempt + 1} failed: {e}")
            continue

@click.command()
@click.option('--bbox', required=True, help='Bounding box as lon_min,lat_min,lon_max,lat_max')
@click.option('--start', required=True, type=click.DateTime(), help='Start date (YYYY-MM-DD)')
@click.option('--end', required=True, type=click.DateTime(), help='End date (YYYY-MM-DD)')
@click.option('--grid', default=1.0, help='Grid size in degrees')
@click.option('--out', required=True, type=click.Path(), help='Output directory')
@click.option('--threads', default=4, help='Number of concurrent downloads')
def main(bbox: str, start: datetime, end: datetime, grid: float, out: str, threads: int):
    """Download Sentinel-1 SAR images for a given area and time period."""
    try:
        # Parse and validate inputs
        bbox_coords = parse_bbox(bbox)
        output_dir = Path(out)
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # Load Sentinel Hub config
        config = SHConfig()
        if not config.sh_client_id or not config.sh_client_secret:
            raise click.ClickException(
                "Sentinel Hub credentials not found. Please configure ~/.sentinelhub/config.json"
            )
        
        # Create grid and date ranges
        grid_cells = create_grid(bbox_coords, grid)
        date_ranges = get_monthly_dates(start, end)
        
        # Prepare download tasks
        tasks = []
        for cell in grid_cells:
            for start_date, end_date in date_ranges:
                tasks.append((cell, start_date, end_date))
        
        # Download images with progress bar
        results = []
        with ThreadPoolExecutor(max_workers=threads) as executor:
            futures = []
            for cell, start_date, end_date in tasks:
                future = executor.submit(
                    download_sar_image,
                    cell,
                    start_date,
                    end_date,
                    output_dir,
                    config
                )
                futures.append(future)
            
            with tqdm(total=len(tasks), desc="Downloading images") as pbar:
                for future in futures:
                    result = future.result()
                    if result:
                        results.append(result)
                    pbar.update(1)
        
        # Save metadata
        if results:
            df = pd.DataFrame(results)
            df.to_csv(output_dir / 'metadata.csv', index=False)
            logger.info(f"Saved {len(results)} images to {output_dir}")
        
        # Check if all expected images were downloaded
        expected_count = len(grid_cells) * len(date_ranges)
        if len(results) < expected_count:
            logger.error(f"Downloaded {len(results)} images, expected {expected_count}")
            raise click.ClickException("Not all images were downloaded successfully")
        
        logger.info("Download completed successfully")
        
    except Exception as e:
        logger.error(f"Error: {e}")
        raise click.ClickException(str(e))

if __name__ == '__main__':
    main()
