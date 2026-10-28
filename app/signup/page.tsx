'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import PasswordField from '@/components/PasswordField'
import { checkPassword } from '@/lib/password'

const inputCls = 'mt-1 w-full rounded-lg border border-gray-300 bg-white p-2.5 text-black focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200'

export default function Signup() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!checkPassword(form.password).strong) {
      return setError('Please choose a strong password (8+ characters with upper and lower case letters, a number and a symbol).')
    }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name } },
    })
    setLoading(false)
    if (error) return setError(error.message)
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-gray-500">It takes a minute. Your portfolio is generated for you.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium">
            Full name
            <input className={inputCls} required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="block text-sm font-medium">
            Email
            <input className={inputCls} type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <PasswordField label="Password" value={form.password}
            onChange={(v) => setForm({ ...form, password: v })} />
          {error && <p className="rounded-lg bg-red-50 p-2 text-sm text-red-600">{error}</p>}
          <button disabled={loading} className="w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
            {loading ? 'Creating...' : 'Sign up'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already registered? <Link href="/login" className="font-medium text-indigo-600">Login</Link>
        </p>
      </div>
    </main>
  )
}