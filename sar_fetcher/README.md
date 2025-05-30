# SAR Fetcher

A command-line tool for downloading Sentinel-1 SAR images from the Sentinel Hub Process API.

## Features

- Downloads Sentinel-1 IW GRD VV band images
- Divides area into configurable grid cells
- Downloads monthly images for a given time period
- Concurrent downloads with configurable thread count
- Automatic retries on failed downloads
- Progress bar and metadata logging
- Type hints and comprehensive error handling

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sar_fetcher.git
cd sar_fetcher
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure Sentinel Hub credentials:
Create a file at `~/.sentinelhub/config.json` with your credentials:
```json
{
    "instance_id": "your-instance-id",
    "sh_client_id": "your-client-id",
    "sh_client_secret": "your-client-secret"
}
```

## Usage

Basic usage:
```bash
python sar_fetcher.py \
    --bbox "73.5,15.5,74.5,16.5" \
    --start "2023-01-01" \
    --end "2023-12-31" \
    --grid 0.5 \
    --out "output_dir" \
    --threads 4
```

### Arguments

- `--bbox`: Bounding box as lon_min,lat_min,lon_max,lat_max
- `--start`: Start date in YYYY-MM-DD format
- `--end`: End date in YYYY-MM-DD format
- `--grid`: Grid size in degrees (default: 1.0)
- `--out`: Output directory
- `--threads`: Number of concurrent downloads (default: 4)

### Output Structure

```
output_dir/
├── 2023/
│   ├── 01/
│   │   ├── 15.50_73.50.tif
│   │   └── 16.00_73.50.tif
│   └── 02/
│       ├── 15.50_73.50.tif
│       └── 16.00_73.50.tif
└── metadata.csv
```

The `metadata.csv` file contains:
- tile: Grid cell coordinates
- timestamp: Image date
- cloud_cover: Not applicable for SAR
- file_path: Relative path to the image

## License

MIT License - see LICENSE file for details.
