#!/usr/bin/env python3
"""
Generate favicon set for Q-Shaastra project
Creates: favicon.ico, PNG icons of various sizes, apple-touch-icon, and site.webmanifest
Design: Bold turquoise "Q" with red quantum/atom element
"""

from PIL import Image, ImageDraw, ImageFont
import os
import json
import struct
import zlib

# Define output directory
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'static', 'favicons')
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Color palette
TURQUOISE = '#17A2B8'  # Bold turquoise
RED = '#DC3545'         # Red for quantum element
WHITE = (255, 255, 255)
TRANSPARENT = (0, 0, 0, 0)

def create_favicon_image(size, transparent_bg=True):
    """
    Create a favicon image with turquoise "Q" and red quantum element
    """
    # Create image with transparent background
    if transparent_bg:
        img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    else:
        img = Image.new('RGB', (size, size), WHITE)
    
    draw = ImageDraw.Draw(img)
    
    # Calculate proportions for the design
    # The "Q" takes up most of the space, with a small quantum element
    
    # For the "Q", we'll draw it with lines/shapes since PIL has limited font support
    # Q dimensions: circle (body) + tail
    circle_radius = int(size * 0.35)
    circle_center_x = size // 2
    circle_center_y = size // 2 - int(size * 0.05)
    
    # Draw the main "Q" circle in turquoise (thick border)
    line_width = max(2, int(size * 0.08))
    
    # Draw circle (Q body)
    q_box = [
        circle_center_x - circle_radius,
        circle_center_y - circle_radius,
        circle_center_x + circle_radius,
        circle_center_y + circle_radius
    ]
    draw.ellipse(q_box, outline=TURQUOISE, width=line_width)
    
    # Draw Q tail (curved line at bottom right)
    tail_start_x = int(circle_center_x + circle_radius * 0.5)
    tail_start_y = int(circle_center_y + circle_radius * 0.7)
    tail_end_x = int(circle_center_x + circle_radius * 0.8)
    tail_end_y = int(circle_center_y + circle_radius * 1.1)
    
    # Draw tail as an arc (approximated with a curve)
    for i in range(line_width):
        draw.line(
            [(tail_start_x + i, tail_start_y),
             (tail_end_x + i, tail_end_y)],
            fill=TURQUOISE,
            width=1
        )
    
    # Draw small red quantum/atom element (nucleus + electrons)
    atom_center_x = int(circle_center_x + circle_radius * 0.6)
    atom_center_y = int(circle_center_y - circle_radius * 0.6)
    
    # Nucleus (small red circle)
    nucleus_radius = max(2, int(size * 0.06))
    nucleus_box = [
        atom_center_x - nucleus_radius,
        atom_center_y - nucleus_radius,
        atom_center_x + nucleus_radius,
        atom_center_y + nucleus_radius
    ]
    draw.ellipse(nucleus_box, fill=RED, outline=RED)
    
    # Electron orbits
    orbit_radius = max(3, int(size * 0.12))
    orbit_width = max(1, int(size * 0.02))
    
    # Draw orbital paths
    for angle_offset in [0, 120, 240]:
        orbit_box = [
            atom_center_x - orbit_radius,
            atom_center_y - orbit_radius,
            atom_center_x + orbit_radius,
            atom_center_y + orbit_radius
        ]
        draw.ellipse(orbit_box, outline=RED, width=orbit_width)
    
    # Draw electron dots
    electron_radius = max(1, int(size * 0.03))
    import math
    for angle_offset in [0, 120, 240]:
        angle = math.radians(angle_offset)
        ex = int(atom_center_x + orbit_radius * math.cos(angle))
        ey = int(atom_center_y + orbit_radius * math.sin(angle))
        e_box = [ex - electron_radius, ey - electron_radius,
                 ex + electron_radius, ey + electron_radius]
        draw.ellipse(e_box, fill=RED, outline=RED)
    
    return img

def create_favicon_ico(sizes=[16, 32, 48, 64]):
    """
    Create favicon.ico with multiple sizes
    """
    images = [create_favicon_image(size, transparent_bg=False).convert('RGB') 
              for size in sizes]
    
    # Save as icon
    ico_path = os.path.join(OUTPUT_DIR, 'favicon.ico')
    images[0].save(ico_path, format='ICO', sizes=[(size, size) for size in sizes])
    print(f"✓ Created: {ico_path}")

def create_png_icons():
    """
    Create PNG icons of various sizes
    """
    sizes_info = [
        (16, 'favicon-16x16.png'),
        (32, 'favicon-32x32.png'),
        (180, 'apple-touch-icon.png'),
        (192, 'android-chrome-192x192.png'),
        (512, 'android-chrome-512x512.png'),
    ]
    
    for size, filename in sizes_info:
        img = create_favicon_image(size, transparent_bg=True)
        filepath = os.path.join(OUTPUT_DIR, filename)
        img.save(filepath, 'PNG')
        print(f"✓ Created: {filepath}")

def create_site_webmanifest():
    """
    Create site.webmanifest for PWA support
    """
    manifest = {
        "name": "Q-Shaastra",
        "short_name": "Q-Shaastra",
        "description": "Quantum Accelerated Reconfigurable Noisy Simulator",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#ffffff",
        "theme_color": "#17A2B8",
        "scope": "/",
        "icons": [
            {
                "src": "/static/favicons/android-chrome-192x192.png",
                "sizes": "192x192",
                "type": "image/png",
                "purpose": "any"
            },
            {
                "src": "/static/favicons/android-chrome-512x512.png",
                "sizes": "512x512",
                "type": "image/png",
                "purpose": "any"
            },
            {
                "src": "/static/favicons/android-chrome-192x192.png",
                "sizes": "192x192",
                "type": "image/png",
                "purpose": "maskable"
            }
        ]
    }
    
    manifest_path = os.path.join(OUTPUT_DIR, 'site.webmanifest')
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)
    print(f"✓ Created: {manifest_path}")

def main():
    """
    Generate complete favicon set
    """
    print("🎨 Generating Q-Shaastra favicon set...")
    print(f"📁 Output directory: {OUTPUT_DIR}\n")
    
    create_favicon_ico()
    create_png_icons()
    create_site_webmanifest()
    
    print("\n✨ Favicon generation complete!")
    print("\nTo use these favicons, add the following to your HTML <head>:")
    print("""
    <!-- Favicon links -->
    <link rel="icon" type="image/x-icon" href="{% static 'favicons/favicon.ico' %}">
    <link rel="icon" type="image/png" sizes="16x16" href="{% static 'favicons/favicon-16x16.png' %}">
    <link rel="icon" type="image/png" sizes="32x32" href="{% static 'favicons/favicon-32x32.png' %}">
    <link rel="apple-touch-icon" href="{% static 'favicons/apple-touch-icon.png' %}">
    <link rel="manifest" href="{% static 'favicons/site.webmanifest' %}">
    <meta name="theme-color" content="#17A2B8">
    """)

if __name__ == '__main__':
    main()
