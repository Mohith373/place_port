'use client'
import { useState } from 'react'
import { checkPassword, generatePassword } from '@/lib/password'

const inputCls = 'w-full rounded-lg border border-gray-300 bg-white p-2.5 pr-16 text-black focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200'

export default function PasswordField({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false)
  const [suggested, setSuggested] = useState(false)
  const [copied, setCopied] = useState(false)
  const { checks, score, total, strong } = checkPassword(value)

  const level =
    score <= 2 ? { text: 'Weak', bar: 'bg-red-500', color: 'text-red-600' }
    : score <= 4 ? { text: 'Fair', bar: 'bg-amber-500', color: 'text-amber-600' }
    : score < total ? { text: 'Good', bar: 'bg-blue-500', color: 'text-blue-600' }
    : { text: 'Strong', bar: 'bg-green-500', color: 'text-green-600' }

  function suggest() {
    onChange(generatePassword(14))
    setShow(true)
    setSuggested(true)
    setCopied(false)
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy this password:', value)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium">
        {label}
        <div className="relative mt-1">
          <input
            className={inputCls}
            type={show ? 'text' : 'password'}
            autoComplete="new-password"
            required
            minLength={8}
            value={value}
            onChange={(e) => { onChange(e.target.value); setSuggested(false) }}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-medium text-indigo-600"
          >
            {show ? 'Hide' : 'Show'}
          </button>
        </div>
      </label>

      {value.length > 0 && (
        <div className="mt-2">
          <div className="flex items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
              <div className={`h-2 rounded-full transition-all ${level.bar}`} style={{ width: `${(score / total) * 100}%` }} />
            </div>
            <span className={`text-xs font-semibold ${level.color}`}>{level.text}</span>
          </div>
          {!strong && (
            <p className="mt-2 rounded-lg bg-amber-50 p-2 text-xs text-amber-800">
              This password is not strong enough. Use 8 or more characters with upper and lower case letters, a number and a symbol, or click “Suggest a strong password”.
            </p>
          )}
          <ul className="mt-2 grid gap-1 text-xs sm:grid-cols-2">
            {checks.map((c) => (
              <li key={c.label} className={c.ok ? 'text-green-600' : 'text-gray-500'}>
                {c.ok ? '✓' : '○'} {c.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button type="button" onClick={suggest}
          className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100">
          Suggest a strong password
        </button>
        {suggested && (
          <>
            <button type="button" onClick={copy}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-gray-50">
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <span className="text-xs text-gray-500">Save it somewhere safe before continuing.</span>
          </>
        )}
      </div>
    </div>
  )
}