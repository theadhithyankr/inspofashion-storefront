export const metadata = {
  title: 'Shipping & Returns',
  description: 'Shipping and returns information for WhatsApp orders.',
}

export default function ShippingReturnsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6f1d1b]">Help</p>
      <h1 className="mt-3 font-display text-5xl text-brand-900 sm:text-7xl">Shipping & returns</h1>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Info title="Shipping" text="Shipping charges, delivery date, and availability are confirmed on WhatsApp before the order is accepted." />
        <Info title="Returns" text="Return or exchange eligibility is confirmed directly by the store based on the item condition and order details." />
      </div>
    </main>
  )
}

function Info({ title, text }) {
  return (
    <div className="border border-brand-200 p-6">
      <h2 className="text-sm font-bold uppercase tracking-[0.18em]">{title}</h2>
      <p className="mt-4 leading-7 text-brand-600">{text}</p>
    </div>
  )
}
