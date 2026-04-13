"""
Deprecated: use fetch_satellite_images.py for the full 35-city Mapbox pipeline.

From backend/:
  node prisma/exportCoords.mjs
  python src/fetch_satellite_images.py
  npm run prisma:seed:images
"""

if __name__ == "__main__":
    print(__doc__)
