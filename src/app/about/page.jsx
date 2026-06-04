export const metadata = {
  title: 'About',
  description: 'About the Inspofashions clothing storefront.',
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6f1d1b]">About</p>
      <h1 className="mt-3 font-display text-5xl text-brand-900 sm:text-7xl">A sharper way to shop clothing.</h1>
      <p className="mt-8 text-lg leading-8 text-brand-600">
        Inspofashions is built around a simple idea: browse a polished catalog, choose your size and colour, then confirm the order directly with the store on WhatsApp. No online payment is collected on this website.
      </p>
    </main>
  )
}
