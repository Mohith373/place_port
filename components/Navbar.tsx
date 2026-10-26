import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import SignOut from '@/components/SignOut'

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let role: string | null = null
  if (user) {
    const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    role = data?.role ?? null
  }

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur print:hidden">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-xl font-extrabold text-indigo-600">PlacePort</Link>
        <div className="flex items-center gap-2 text-sm font-medium">
          {user ? (
            <>
              <Link href={role === 'admin' ? '/admin' : '/dashboard'} className="rounded-lg px-3 py-1.5 hover:bg-gray-100">
                {role === 'admin' ? 'Admin' : 'My portfolio'}
              </Link>
              <SignOut />
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg px-3 py-1.5 hover:bg-gray-100">Login</Link>
              <Link href="/signup" className="rounded-lg bg-indigo-600 px-4 py-1.5 text-white hover:bg-indigo-700">Sign up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}