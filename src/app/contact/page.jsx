import { getSetting } from '@/lib/storefront-data'

export const metadata = {
  title: 'Contact',
  description: 'Contact Inspofashions.',
}

export default async function ContactPage() {
  const settings = await getSetting('general_settings')
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6f1d1b]">Contact</p>
      <h1 className="mt-3 font-display text-5xl text-brand-900 sm:text-7xl">Need help with an order?</h1>
      <p className="mt-8 text-lg leading-8 text-brand-600">
        Message us on WhatsApp for product availability, sizing help, and order confirmation.
      </p>
      <div className="mt-8 border border-brand-200 p-6">
        <p className="font-semibold">Email</p>
        <p className="mt-1 text-brand-600">{settings?.support_email || 'help@inspofashions.com'}</p>
        <p className="mt-6 font-semibold">WhatsApp</p>
        <p className="mt-1 text-brand-600">{settings?.whatsapp_number || 'Configured in admin settings'}</p>
      </div>
    </main>
  )
}
