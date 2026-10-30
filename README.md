# Darlin Phones & Accessories

Next.js App Router showcase using React components and CSS. Product images live in `public/assets`.

```sh
npm install
npm run dev
```

Open `http://localhost:3000` after starting the development server.

For a production build:

```sh
npm run build
npm start
```

This is a standalone Next.js project. No hosting provider is configured.

Enquiries go to the shop WhatsApp number +233 50 741 0361. To override it, copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_WHATSAPP_NUMBER` in international format (country code and number). Enquire links open a WhatsApp chat with a product-specific message. Restart the development server after changing this value.

Product availability and prices still require confirmation.

## Darlin's Collection

The image gallery lives at `/collection/`. Edit `components/collection-items.json`
to add, remove, or reorder photos. Store new images in `public/assets/collection/`
and reference them as `/assets/collection/your-photo.jpg`.

Each entry uses a unique `id`, `title`, `category` (`iPhone` or `Accessories`),
`image`, descriptive `alt`, and `description`. Optional presentation fields are
`theme` (`light`, `dark`, `warm`, or `blue`), `fit` (`cover` or `contain`), and
`position` (CSS object-position, such as `center` or `50% 30%`). Use `cover` for
full-bleed photographs and `contain` for standalone product images.

Set `product` to an existing product image key (for example `15-pro`, `air`,
`case-woven`, or `airpods`) to open its colour/storage selector and zoom viewer.
An optional `selectedColor` must match a finish name exactly. When `product` is
omitted, the tile opens its own photo and description in the zoom viewer.

The file is the gallery content source for now; there is no upload interface or
CMS dependency. A future CMS can replace this data source without changing the
gallery layout. Rebuild/redeploy after changing entries or images in production.
