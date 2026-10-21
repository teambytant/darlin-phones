"""Download official product finish images and create the local variant manifest."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import html
import json
import re
import urllib.request
from io import BytesIO
from PIL import Image, ImageStat

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'public/assets/colours'
DEST.mkdir(parents=True, exist_ok=True)

def read(url):
    return urllib.request.urlopen(url, timeout=45).read()

def image_urls(page):
    return list(dict.fromkeys(html.unescape(u).rstrip('\\') for u in re.findall(r'https://store\.storeimages[^"\s<>]+', page)))

def save(name, url, extension='jpg'):
    path = DEST / f'{name}.{extension}'
    if not path.exists():
        path.write_bytes(read(url))
    return '/assets/colours/' + path.name

PHONES = [
    ('pro', 'iphone-18-pro', [('burgundy', 'Burgundy', '#57303a'), ('glacier', 'Glacier', '#cbdde6'), ('silver', 'Silver', '#dddcd8'), ('black', 'Black', '#353535')]),
    ('air', 'iphone-air', [('skyblue', 'Sky Blue', '#cbdfe8'), ('lightgold', 'Light Gold', '#e9e2cf'), ('cloudwhite', 'Cloud White', '#ecebe7'), ('spaceblack', 'Space Black', '#252525')]),
    ('standard', 'iphone-17', [('lavender', 'Lavender', '#b9afd2'), ('sage', 'Sage', '#bccbb4'), ('mistblue', 'Mist Blue', '#d1dfeb'), ('white', 'White', '#eeeae2'), ('black', 'Black', '#353535')]),
    ('duo', 'iphone-duo', [('star-white', 'Star White', '#efede6'), ('night-sky', 'Night Sky', '#3d4650')]),
    ('17e', 'iphone-17e', [('softpink', 'Soft Pink', '#e9ccd0'), ('white', 'White', '#ecebe7'), ('black', 'Black', '#262626')]),
    ('16', 'iphone-16', [('ultramarine', 'Ultramarine', '#5865a9'), ('teal', 'Teal', '#9dbdb6'), ('pink', 'Pink', '#e6a9c6'), ('white', 'White', '#ecebe7'), ('black', 'Black', '#262626')]),
]

def phone_variants(item):
    key, slug, finishes = item
    urls = image_urls(read('https://www.apple.com/shop/buy-iphone/' + slug).decode())
    result = []
    for token, name, colour in finishes:
        pattern = (rf'/is/{slug}-{token}-select-\d+(?:_GEO_US)?\?' if key == '16' else rf'/is/{slug}-finish-select-{token}-\d+(?:_GEO_US)?\?')
        matches = [u for u in urls if re.search(pattern, u)]
        if not matches:
            raise ValueError(f'Missing official image: {slug} {name}')
        url = next((u for u in matches if 'fmt=jpeg' in u), matches[0])
        extension = 'png' if 'fmt=png' in url else 'jpg'
        result.append({'name': name, 'hex': colour, 'image': save(key + '-' + token, url, extension)})
    return key, result

HEX = {'burgundy': '#683440', 'olive': '#646544', 'taupe': '#a69889', 'chambray-blue': '#88a8bf', 'chambrayblue': '#88a8bf', 'black': '#252525', 'navy': '#25384c', 'navy-blue': '#25384c', 'navyblue': '#25384c', 'magenta': '#b3427c', 'wildflower': '#8598b8', 'wildflower-blue': '#8598b8', 'wildflowerblue': '#8598b8', 'light-gray': '#d2d2d0', 'lightgray': '#d2d2d0'}

def accessory_variants(item):
    key, sku = item
    page = read(f'https://www.apple.com/shop/product/{sku.lower()}zm/a').decode()
    swatches = re.findall(r'"text":"([^"]+)","selected":(?:true|false),"radioValue":"([^"]+)","sortOrder":\d+,"swatchImage":\{"sources":\[\{"srcSet":"https://[^"\s]+/is/([A-Z0-9]+)_SW_COLOR', page)
    swatches = list(dict.fromkeys(swatches))
    if not swatches:
        raise ValueError('Missing accessory finishes: ' + key)
    def variant(swatch):
        name, token, variant_sku = swatch
        variant_page = page if variant_sku == sku else read(f'https://www.apple.com/shop/product/{variant_sku.lower()}zm/a').decode()
        urls = image_urls(variant_page)
        url = next(u for u in urls if f'/is/{variant_sku}?' in u and 'fmt=jpeg' in u)
        swatch_url = next(u for u in urls if f'/is/{variant_sku}_SW_COLOR?' in u and 'fmt=jpeg' in u)
        swatch_image = Image.open(BytesIO(read(swatch_url))).convert('RGB')
        width, height = swatch_image.size
        mean = ImageStat.Stat(swatch_image.crop((width // 3, height // 3, 2 * width // 3, 2 * height // 3))).mean
        colour = '#' + ''.join(f'{round(channel):02x}' for channel in mean)
        return {'name': name, 'hex': colour, 'image': save(key + '-' + token, url)}
    with ThreadPoolExecutor(max_workers=4) as pool:
        return key, list(pool.map(variant, swatches))

if __name__ == '__main__':
    manifest = {}
    with ThreadPoolExecutor(max_workers=4) as pool:
        for key, variants in pool.map(phone_variants, PHONES):
            manifest[key] = variants
            print(key, len(variants), flush=True)
    for item in [('case-woven', 'MKD14'), ('case-silicone', 'MK944')]:
        key, variants = accessory_variants(item)
        manifest[key] = variants
        print(key, len(variants), flush=True)
    # The wallet SKU is read from the existing official accessories page.
    page = read('https://www.apple.com/shop/iphone/accessories').decode()
    from html.parser import HTMLParser
    class WalletImage(HTMLParser):
        sku = None
        def handle_starttag(self, tag, attrs):
            data = dict(attrs)
            if tag == 'img' and data.get('alt', '').startswith('iPhone FineWoven Wallet with MagSafe, olive color'):
                match = re.search(r'/is/([A-Z0-9]+)\?', data.get('src', ''))
                if match:
                    self.sku = match[1]
    parser = WalletImage()
    parser.feed(page)
    key, variants = accessory_variants(('wallet', parser.sku))
    manifest[key] = variants
    print(key, len(variants), flush=True)
    (ROOT / 'components/product-variants.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
