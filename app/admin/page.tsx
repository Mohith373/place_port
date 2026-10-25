import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SignOut from '@/components/SignOut'

export default async function Admin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: me } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (me?.role !== 'admin') redirect('/dashboard')

  const { count } = await supabase
    .from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student')

  return (
    <main className="mx-auto max-w-4xl p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin dashboard</h1>
        <SignOut />
      </div>
      <div className="mt-6 inline-block rounded-xl border p-6">
        <div className="text-3xl font-bold text-indigo-600">{count ?? 0}</div>
        <div className="text-gray-600">Total students</div>
      </div>
    </main>
  )
}