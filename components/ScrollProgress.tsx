'use client'
import { useEffect, useRef } from 'react'

export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = bar.current
    if (!el) return
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      el.style.transform = `scaleX(${h > 0 ? Math.min(window.scrollY / h, 1) : 0})`
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(document.body)
    return () => {
      window.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [])

  return (
    <div
      ref={bar}
      style={{ transform: 'scaleX(0)' }}
      className="fixed left-0 top-0 z-[60] h-1 w-full origin-left bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-indigo-500 print:hidden"
    />
  )
}