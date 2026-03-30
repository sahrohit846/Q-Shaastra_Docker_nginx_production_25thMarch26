#!/usr/bin/env python3
"""
Convert Q-Shaastra logo to favicon set with multiple sizes.
Generates favicon.ico and PNG files for different devices.
"""

import os
from PIL import Image
import json
from pathlib import Path

def convert_logo_to_favicons(source_logo_path, output_dir):
    """
    Convert source logo to favicon set.
    
    Args:
        source_logo_path: Path to source logo image
        output_dir: Directory to save favicon files
    """
    
    # Create output directory
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    # Open the logo image
    print(f"Opening logo from: {source_logo_path}")
    logo = Image.open(source_logo_path).convert("RGBA")
    
    print(f"Original logo size: {logo.size}")
    
    # Define favicon sizes
    favicon_sizes = {
        'favicon-16x16.png': (16, 16),
        'favicon-32x32.png': (32, 32),
        'apple-touch-icon.png': (180, 180),  # iOS home screen
        'android-chrome-192x192.png': (192, 192),
        'android-chrome-512x512.png': (512, 512),
    }
    
    # Generate PNG files for each size
    print("\nGenerating favicon PNG files:")
    png_images = []
    for filename, size in favicon_sizes.items():
        # Resize with high-quality resampling
        resized_logo = logo.resize(size, Image.Resampling.LANCZOS)
        output_path = os.path.join(output_dir, filename)
        
        # Save PNG
        resized_logo.save(output_path, 'PNG', optimize=True)
        file_size = os.path.getsize(output_path)
        print(f"  ✓ {filename:<30} {size} px - {file_size:>6} bytes")
        
        # Keep 16, 32 for ICO (highest quality)
        if size in [(16, 16), (32, 32)]:
            png_images.append(resized_logo)
    
    # Generate favicon.ico (multi-size)
    print("\nGenerating favicon.ico (multi-size):")
    ico_sizes = [(16, 16), (32, 32), (64, 64), (128, 128)]
    ico_images = []
    for size in ico_sizes:
        resized = logo.resize(size, Image.Resampling.LANCZOS)
        ico_images.append(resized)
    
    favicon_ico_path = os.path.join(output_dir, 'favicon.ico')
    ico_images[0].save(favicon_ico_path, 'ICO', sizes=[size for _, size in zip(ico_images, ico_sizes)])
    ico_size = os.path.getsize(favicon_ico_path)
    print(f"  ✓ favicon.ico - {ico_size:>6} bytes (16, 32, 64, 128 px)")
    
    # Generate web manifest
    print("\nGenerating site.webmanifest:")
    manifest = {
        "name": "Q-Shaastra - Quantum Research Platform",
        "short_name": "Q-Shaastra",
        "icons": [
            {
                "src": "/static/favicons/android-chrome-192x192.png",
                "sizes": "192x192",
                "type": "image/png"
            },
            {
                "src": "/static/favicons/android-chrome-512x512.png",
                "sizes": "512x512",
                "type": "image/png"
            }
        ],
        "theme_color": "#17A2B8",
        "background_color": "#ffffff",
        "display": "standalone"
    }
    
    manifest_path = os.path.join(output_dir, 'site.webmanifest')
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2)
    
    manifest_size = os.path.getsize(manifest_path)
    print(f"  ✓ site.webmanifest - {manifest_size:>6} bytes")
    
    # Summary
    print("\n" + "="*50)
    print("✓ Favicon conversion complete!")
    print("="*50)
    print(f"Output directory: {output_dir}")
    print("\nFiles generated:")
    for filename in os.listdir(output_dir):
        filepath = os.path.join(output_dir, filename)
        size = os.path.getsize(filepath)
        print(f"  • {filename:<35} {size:>8} bytes")
    
    total_size = sum(os.path.getsize(os.path.join(output_dir, f)) for f in os.listdir(output_dir))
    print(f"\nTotal size: {total_size} bytes")

if __name__ == "__main__":
    # Configuration
    source_logo = "/home/cpatwrohit/Desktop/Q-Shaastra_Docker_nginx_23rdMarch26/static/images/Q-Shaastra_ Logo_.png"
    output_directory = "/home/cpatwrohit/Desktop/Q-Shaastra_Docker_nginx_23rdMarch26/static/favicons"
    
    # Create backup of current favicons
    import shutil
    backup_dir = f"{output_directory}.backup"
    if os.path.exists(output_directory):
        print(f"Backing up current favicons to: {backup_dir}")
        if os.path.exists(backup_dir):
            shutil.rmtree(backup_dir)
        shutil.copytree(output_directory, backup_dir)
        # Clear old files
        for f in os.listdir(output_directory):
            os.remove(os.path.join(output_directory, f))
    
    # Convert logo to favicons
    convert_logo_to_favicons(source_logo, output_directory)
    
    print("\n✓ Ready to deploy! Run: docker compose restart web nginx")
