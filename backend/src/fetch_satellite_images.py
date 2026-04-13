"""
Download Mapbox satellite-v9 static images for each city in prisma/cityCoords.json.

Prereq: node prisma/exportCoords.mjs (from backend/)
Env: MAPBOX_ACCESS_TOKEN in .env or environment
Run from backend/: python src/fetch_satellite_images.py
"""
import json
import os
import sys
from pathlib import Path

import requests
from dotenv import load_dotenv

# backend/ as cwd expected
BACKEND_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(BACKEND_ROOT / ".env")

ZOOM = 12
# Smaller than 1280@2x to limit DB size; still readable in-game
WIDTH, HEIGHT = 800, 800


def main() -> None:
    token = os.environ.get("MAPBOX_ACCESS_TOKEN")
    if not token:
        print("Missing MAPBOX_ACCESS_TOKEN in environment or backend/.env", file=sys.stderr)
        sys.exit(1)

    coords_path = BACKEND_ROOT / "prisma" / "cityCoords.json"
    if not coords_path.is_file():
        print(
            f"Missing {coords_path}. Run: node prisma/exportCoords.mjs",
            file=sys.stderr,
        )
        sys.exit(1)

    out_dir = BACKEND_ROOT / "prisma" / "seed-images"
    out_dir.mkdir(parents=True, exist_ok=True)

    cities = json.loads(coords_path.read_text(encoding="utf-8"))
    for i, row in enumerate(cities):
        lat, lng = float(row["lat"]), float(row["lng"])
        key = row["imageKey"]
        url = (
            f"https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/"
            f"{lng},{lat},{ZOOM}/{WIDTH}x{HEIGHT}@2x?access_token={token}"
        )
        r = requests.get(url, timeout=120)
        try:
            r.raise_for_status()
        except requests.HTTPError as e:
            print(f"Failed {key} ({row.get('name')}): {e}", file=sys.stderr)
            sys.exit(1)

        dest = out_dir / f"{key}.jpg"
        dest.write_bytes(r.content)
        print(f"[{i + 1}/{len(cities)}] {key}.jpg")

    print(f"Done. Images in {out_dir}")


if __name__ == "__main__":
    main()
