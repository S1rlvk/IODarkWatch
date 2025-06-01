#!/usr/bin/env python3
"""
Check SAR file contents and structure
"""

import zipfile
from pathlib import Path

def check_sentinel1_structure():
    zip_path = "/Volumes/SanDisk 1 TB/Datasets/SAR_Images/S1A_IW_RAW__0SDV_20240102T141608_20240102T141641_051929_06462F_8BBA.zip"
    
    print("🔍 Analyzing Sentinel-1 ZIP structure...")
    
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        files = zip_ref.namelist()
        
        print(f"📦 Total files: {len(files)}")
        
        # Analyze file types
        extensions = {}
        for f in files:
            if '.' in f:
                ext = f.split('.')[-1].lower()
                extensions[ext] = extensions.get(ext, 0) + 1
        
        print("\n📊 File types:")
        for ext, count in sorted(extensions.items()):
            print(f"  .{ext}: {count} files")
        
        print("\n📁 Sample files:")
        for i, f in enumerate(files[:15]):
            size = zip_ref.getinfo(f).file_size / (1024*1024)  # MB
            print(f"  {f} ({size:.1f} MB)")
        
        if len(files) > 15:
            print(f"  ... and {len(files) - 15} more files")
        
        # Check for measurement files (actual SAR data)
        measurement_files = [f for f in files if 'measurement' in f.lower()]
        annotation_files = [f for f in files if 'annotation' in f.lower()]
        calibration_files = [f for f in files if 'calibration' in f.lower()]
        
        print(f"\n🛰️ SAR data structure:")
        print(f"  Measurement files: {len(measurement_files)}")
        print(f"  Annotation files: {len(annotation_files)}")
        print(f"  Calibration files: {len(calibration_files)}")
        
        if measurement_files:
            print(f"\n📊 Measurement files (SAR data):")
            for f in measurement_files:
                size = zip_ref.getinfo(f).file_size / (1024*1024)
                print(f"  {f} ({size:.1f} MB)")

def check_smap_files():
    smap_files = [
        "/Volumes/SanDisk 1 TB/Datasets/SAR_Images/SMAP_L1A_RADAR_47830_D_20240114T234918_R19240_001.h5",
        "/Volumes/SanDisk 1 TB/Datasets/SAR_Images/SMAP_L1A_RADAR_47649_A_20240102T135842_R19240_001.h5"
    ]
    
    print("\n🛰️ SMAP Files Analysis:")
    
    try:
        import h5py
        
        for smap_file in smap_files:
            if Path(smap_file).exists():
                print(f"\n📁 {Path(smap_file).name}:")
                
                with h5py.File(smap_file, 'r') as f:
                    print(f"  📊 HDF5 groups and datasets:")
                    
                    def print_structure(name, obj):
                        if isinstance(obj, h5py.Dataset):
                            print(f"    Dataset: {name}")
                            print(f"      Shape: {obj.shape}")
                            print(f"      Type: {obj.dtype}")
                        elif isinstance(obj, h5py.Group):
                            print(f"    Group: {name}")
                    
                    f.visititems(print_structure)
                    
    except ImportError:
        print("  ⚠️  h5py not installed - install with: pip install h5py")

if __name__ == "__main__":
    check_sentinel1_structure()
    check_smap_files() 