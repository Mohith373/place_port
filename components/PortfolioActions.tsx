'use client'
import { useState } from 'react'

export default function PortfolioActions() {
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy this link:', window.location.href)
    }
  }

  return (
    <div className="mb-3 flex justify-end gap-2 print:hidden">
      <button onClick={copyLink} className="rounded border bg-white px-3 py-1 text-sm text-gray-800">
        {copied ? 'Copied!' : 'Copy link'}
      </button>
      <button onClick={() => window.print()} className="rounded bg-indigo-600 px-3 py-1 text-sm text-white">
        Download PDF
      </button>
    </div>
  )
}