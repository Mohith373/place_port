'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const inputCls = 'mt-1 w-full rounded-lg border border-gray-300 bg-white p-2.5 text-black focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200'

export default function ResetPassword() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) return setError('Passwords do not match')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setLoading(false)
      return setError(
        error.message.toLowerCase().includes('session')
          ? 'This reset link has expired. Please request a new one.'
          : error.message
      )
    }
    await supabase.auth.signOut()
    setDone(true)
    setLoading(false)
    setTimeout(() => router.push('/login'), 1800)
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold">Set a new password</h1>

        {done ? (
          <p className="mt-6 rounded-lg bg-green-50 p-4 text-sm text-green-800">
            Password updated! Taking you to the login page...
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block text-sm font-medium">
              New password (min 6 characters)
              <input className={inputCls} type="password" minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <label className="block text-sm font-medium">
              Confirm new password
              <input className={inputCls} type="password" minLength={6} required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </label>
            {error && (
              <p className="rounded-lg bg-red-50 p-2 text-sm text-red-600">
                {error}{' '}
                {error.includes('expired') && <Link href="/forgot-password" className="font-medium underline">Request a new link</Link>}
              </p>
            )}
            <button disabled={loading} className="w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
              {loading ? 'Updating...' : 'Update password'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}