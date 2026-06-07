import { getSetting } from '@/lib/storefront-data'

export const metadata = {
  title: 'Size Guide',
  description: 'Find the right clothing size before ordering on WhatsApp.',
}

async function getSizeChartData() {
  try {
    const sizeChartData = await getSetting('size_chart')
    return sizeChartData || null
  } catch {
    return null
  }
}

export default async function SizeGuidePage() {
  const backendSizeChart = await getSizeChartData()

  // Default size chart data (fallback)
  const defaultRows = [
    ['XS', '34', '28', '36'],
    ['S', '36', '30', '38'],
    ['M', '38', '32', '40'],
    ['L', '40', '34', '42'],
    ['XL', '42', '36', '44'],
    ['XXL', '44', '38', '46'],
  ]

  // Use backend data if available, otherwise use defaults
  const rows = backendSizeChart?.rows || defaultRows
  const headers = backendSizeChart?.headers || ['Size', 'Chest', 'Waist', 'Hip']
  const description = backendSizeChart?.description || 'Measurements are indicative. Confirm fit details on WhatsApp before final purchase if you are between sizes.'

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6f1d1b]">Fit</p>
      <h1 className="mt-3 font-display text-5xl text-brand-900 sm:text-7xl">Size guide</h1>
      
      {backendSizeChart?.title && (
        <p className="mt-6 text-lg text-brand-700">{backendSizeChart.title}</p>
      )}

      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr className="border-b border-brand-300 text-xs uppercase tracking-[0.18em] text-brand-500">
              {headers.map((header) => (
                <th key={header} className="py-4 px-2">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className="border-b border-brand-100 hover:bg-brand-50 transition">
                {row.map((cell, idx) => (
                  <td key={`${row[0]}-${idx}`} className="py-4 px-2 font-semibold text-brand-900">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 rounded border border-brand-200 bg-brand-50 p-4">
        <p className="text-sm text-brand-700">{description}</p>
      </div>

      {backendSizeChart?.additionalInfo && (
        <div className="mt-6 space-y-3">
          {backendSizeChart.additionalInfo.map((info, idx) => (
            <div key={idx} className="border-l-4 border-brand-900 pl-4 py-2">
              <p className="text-sm text-brand-700">{info}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
