export const metadata = {
  title: 'Size Guide',
  description: 'Find the right clothing size before ordering on WhatsApp.',
}

export default function SizeGuidePage() {
  const rows = [
    ['XS', '34', '28', '36'],
    ['S', '36', '30', '38'],
    ['M', '38', '32', '40'],
    ['L', '40', '34', '42'],
    ['XL', '42', '36', '44'],
    ['XXL', '44', '38', '46'],
  ]

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6f1d1b]">Fit</p>
      <h1 className="mt-3 font-display text-5xl text-brand-900 sm:text-7xl">Size guide</h1>
      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr className="border-b border-brand-300 text-xs uppercase tracking-[0.18em] text-brand-500">
              <th className="py-4">Size</th>
              <th className="py-4">Chest</th>
              <th className="py-4">Waist</th>
              <th className="py-4">Hip</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className="border-b border-brand-100">
                {row.map((cell) => <td key={cell} className="py-4 font-semibold">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-6 text-brand-600">Measurements are indicative. Confirm fit details on WhatsApp before final purchase if you are between sizes.</p>
    </main>
  )
}
