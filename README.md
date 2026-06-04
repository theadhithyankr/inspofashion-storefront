# Inspofashions Storefront

Next.js storefront for a premium clothing brand with Supabase catalog data and WhatsApp-only checkout.

## Features
- Editorial mobile-first home page
- SEO-friendly collection and product routes
- Product image galleries, size/color selection, and cart persistence
- WhatsApp checkout with validated customer details
- No payment collection and no stored customer/order PII
- Sitemap, robots, metadata, security headers, and Vercel-ready config

## Tech Stack
- Next.js App Router
- React
- Tailwind CSS
- Supabase
- lucide-react

## Local Development
```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Production Build
```bash
npm run lint
npm run build
```

## Vercel
- Root directory: `storefront`
- Framework preset: Next.js
- Build command: `npm run build`
- Environment variables: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`
