import { DM_Sans, Cormorant_Garamond } from 'next/font/google'
import '../index.css'
import { StorefrontShell } from '@/components/storefront/storefront-shell'
import { getStorefrontData } from '@/lib/storefront-data'

const sans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const display = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://inspofashions.com'),
  title: {
    default: 'Inspo Fashions | Premium Nightwear',
    template: '%s | Inspo Fashions',
  },
  description: 'Comfort, beautifully yours. Discover premium nightwear designed for everyday elegance. Affordable luxury with WhatsApp ordering.',
  openGraph: {
    title: 'Inspo Fashions',
    description: 'Premium nightwear with affordable luxury.',
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
