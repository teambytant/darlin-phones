"""Fetch official Apple comparison images for the iPhone 12-16 catalogue.

Existing finish entries are preserved. Assets are kept locally so catalogue
browsing and product zoom do not depend on external image hosts.
"""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import json
import re
import time
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / 'components/product-variants.json'
SOURCE = 'https://www.apple.com/v/iphone/compare/an/built/styles/overview.built.css'
COLOURS = {
    'black': ('Black', '#252525'), 'white': ('White', '#f2f0eb'),
    'blue': ('Blue', '#7b9db5'), 'green': ('Green', '#9bb9a6'),
    'purple': ('Purple', '#b9afd0'), 'red': ('(PRODUCT)RED', '#bc263b'),
    'pink': ('Pink', '#edcbd1'), 'yellow': ('Yellow', '#f3df9c'),
    'midnight': ('Midnight', '#292d35'), 'starlight': ('Starlight', '#eee9df'),
    'gold': ('Gold', '#e8d7bd'), 'silver': ('Silver', '#e2e3e2'),
    'graphite': ('Graphite', '#595956'), 'pacificblue': ('Pacific Blue', '#456775'),
    'sierrablue': ('Sierra Blue', '#a5bdcf'), 'alpinegreen': ('Alpine Green', '#576e5b'),
    'deeppurple': ('Deep Purple', '#665c70'), 'spaceblack': ('Space Black', '#363636'),
    'naturaltitanium': ('Natural Titanium', '#b7b2a8'), 'bluetitanium': ('Blue Titanium', '#465264'),
    'whitetitanium': ('White Titanium', '#e8e6df'), 'blacktitanium': ('Black Titanium', '#434442'),
    'deserttitanium': ('Desert Titanium', '#c8ac95'),
}


def read(url):
    for attempt in range(3):
        try:
            with urllib.request.urlopen(url, timeout=30) as response:
                return response.read()
        except Exception:
            if attempt == 2:
                raise
            time.sleep(1)


def fetch_asset(item):
    selector, url = item
    model, token = selector.rsplit('-', 1)
    key = model.removeprefix('iphone-')
    path = ROOT / 'public/assets/colours' / f'{key}-{token}.jpg'
    if not path.exists():
        content = read('https://www.apple.com' + url.replace('_large.jpg', '_large_2x.jpg'))
        if not content.startswith(b'\xff\xd8'):
            raise ValueError(f'Expected JPEG for {selector}')
        path.write_bytes(content)
    name, colour = COLOURS[token]
    return key, {'name': name, 'hex': colour, 'image': '/assets/colours/' + path.name}


if __name__ == '__main__':
    manifest = json.loads(MANIFEST.read_text(encoding='utf-8'))
    css = read(SOURCE).decode()
    matches = dict(re.findall(
        r'\.image-compare-(iphone-(?:12|13|14|15|16)(?:-pro(?:-max)?)?-[a-z]+)\{[^{}]*background-image:url\("([^\"]+_large\.jpg)"\)', css))
    items = [(selector, url) for selector, url in matches.items()
             if selector.rsplit('-', 1)[0].removeprefix('iphone-') not in manifest]
    added = {}
    with ThreadPoolExecutor(max_workers=6) as pool:
        for key, variant in pool.map(fetch_asset, items):
            added.setdefault(key, []).append(variant)
    expected = {f'{number}{suffix}' for number in range(12, 17)
                for suffix in ['', '-pro', '-pro-max']} - set(manifest)
    if set(added) != expected:
        raise ValueError(f'Missing models: {expected - set(added)}')
    for key, variants in added.items():
        manifest[key] = variants
        first_image = ROOT / 'public' / variants[0]['image'].lstrip('/')
        (ROOT / 'public/assets' / f'{key}.jpg').write_bytes(first_image.read_bytes())
        print(key, len(variants), 'finishes', flush=True)
    MANIFEST.write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
