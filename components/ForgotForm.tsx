'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const inputCls = 'mt-1 w-full rounded-lg border border-gray-300 bg-white p-2.5 text-black focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200'

export default function ForgotForm({ linkExpired }: { linkExpired: boolean }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })
    setLoading(false)
    if (error) return setError(error.message)
    setSent(true)
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold">Forgot your password?</h1>
        <p className="mt-1 text-sm text-gray-500">Enter your email and we will send you a link to set a new one.</p>

        {linkExpired && !sent && (
          <p className="mt-4 rounded-lg bg-amber-50 p-2 text-sm text-amber-800">
            That reset link is invalid or has expired. Please request a new one.
          </p>
        )}

        {sent ? (
          <div className="mt-6 rounded-lg bg-green-50 p-4 text-sm text-green-800">
            If an account exists for <b>{email}</b>, a reset link is on its way. Check your inbox (and spam folder), and open the link in this same browser.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block text-sm font-medium">
              Email
              <input className={inputCls} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            {error && <p className="rounded-lg bg-red-50 p-2 text-sm text-red-600">{error}</p>}
            <button disabled={loading} className="w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-sm text-gray-600">
          <Link href="/login" className="font-medium text-indigo-600">← Back to login</Link>
        </p>
      </div>
    </main>
  )
}