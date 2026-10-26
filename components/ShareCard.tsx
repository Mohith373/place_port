'use client'
import { useState, useSyncExternalStore } from 'react'
import { QRCodeSVG } from 'qrcode.react'

export default function ShareCard({ username, isPublic }: { username: string; isPublic: boolean }) {
  const origin = useSyncExternalStore(() => () => {}, () => window.location.origin, () => '')
  const [copied, setCopied] = useState(false)

  const portfolio = `${origin}/p/${username}`
  const resume = `${origin}/resume/${username}`
  const msg = encodeURIComponent(`Check out my placement portfolio: ${portfolio}`)

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy this link:', text)
    }
  }

  const btn = 'rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-gray-50'

  return (
    <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 sm:p-5">
      <h2 className="font-semibold text-indigo-900">Your shareable portfolio</h2>
      {!isPublic && (
        <p className="mt-1 rounded bg-amber-100 p-2 text-sm text-amber-800">
          Your portfolio is set to private. Tick "Make my portfolio public" below and Save so recruiters can open it.
        </p>
      )}
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input readOnly value={portfolio}
          className="w-full rounded-lg border border-gray-300 bg-white p-2 text-sm text-black" />
        <button onClick={() => copy(portfolio)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
          {copied ? 'Copied!' : 'Copy link'}
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <a className={btn} href={`/p/${username}`} target="_blank" rel="noopener noreferrer">View portfolio</a>
        <a className={btn} href={`/resume/${username}`} target="_blank" rel="noopener noreferrer">View / download resume</a>
        <a className={btn} href={`https://wa.me/?text=${msg}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        <a className={btn} href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(portfolio)}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a className={btn} href={`mailto:?subject=${encodeURIComponent('My placement portfolio')}&body=${msg}`}>Email</a>
        <button className={btn} onClick={() => copy(resume)}>Copy resume link</button>
      </div>
      {origin && (
        <div className="mt-4 flex items-center gap-4">
          <div className="rounded-lg bg-white p-2">
            <QRCodeSVG value={portfolio} size={96} />
          </div>
          <p className="text-sm text-indigo-900">
            Scan to open your portfolio. Take a screenshot and add it to your printed resume or visiting card.
          </p>
        </div>
      )}
    </div>
  )
}