import Link from 'next/link'

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl p-10 text-center">
      <h1 className="text-4xl font-bold">PlacePort</h1>
      <p className="mt-3 text-gray-600">
        Build your B.Tech placement portfolio and share it with recruiters.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/signup" className="rounded bg-indigo-600 px-5 py-2 text-white">Sign up</Link>
        <Link href="/login" className="rounded border border-indigo-600 px-5 py-2 text-indigo-600">Login</Link>
      </div>
    </main>
  )
}