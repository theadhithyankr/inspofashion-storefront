import { Manrope, Playfair_Display } from 'next/font/google'
import '../index.css'
import { StorefrontShell } from '@/components/storefront/storefront-shell'
import { getStorefrontData } from '@/lib/storefront-data'

const sans = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const display = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://inspofashions.com'),
  title: {
    default: 'Inspofashions | Premium Clothing',
    template: '%s | Inspofashions',
  },
  description: 'Shop premium clothing and send your order directly on WhatsApp. No online payment required.',
  openGraph: {
    title: 'Inspofashions',
    description: 'Premium clothing with WhatsApp checkout.',
    type: 'website',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1c1917',
}

export default async function RootLayout({ children }) {
  const data = await getStorefrontData()

  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${sans.variable} ${display.variable}`}>
      <body>
        <StorefrontShell data={data}>{children}</StorefrontShell>
      </body>
    </html>
  )
}
