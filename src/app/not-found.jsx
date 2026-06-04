import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6f1d1b]">404</p>
      <h1 className="mt-3 font-display text-5xl text-brand-900">This piece is not on the rack.</h1>
      <p className="mt-5 text-brand-600">The page may have moved or the item may no longer be active.</p>
      <Link href="/" className="mt-8 inline-block bg-brand-900 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white">
        Return home
      </Link>
    </main>
  )
}
