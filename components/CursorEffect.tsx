'use client'
import { useEffect, useRef } from 'react'

export default function CursorEffect() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const ringInner = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const d = dot.current
    const r = ring.current
    const ri = ringInner.current
    if (!d || !r || !ri) return

    let x = 0, y = 0, rx = 0, ry = 0
    let raf = 0
    let inside = false
    let down = false
    let mode: 'default' | 'link' | 'text' = 'default'
    let applied = ''

    const apply = () => {
      const key = `${mode}-${down}-${inside}`
      if (key === applied) return
      applied = key
      const show = inside && mode !== 'text'
      d.style.opacity = show ? '1' : '0'
      r.style.opacity = show ? '1' : '0'
      d.style.scale = mode === 'link' ? '0.4' : '1'
      ri.style.transform = down ? 'scale(0.75)' : mode === 'link' ? 'scale(1.9)' : 'scale(1)'
      ri.style.backgroundColor = mode === 'link' ? 'rgba(99,102,241,0.15)' : 'transparent'
      ri.style.borderColor = mode === 'link' ? 'rgba(217,70,239,0.8)' : 'rgba(99,102,241,0.6)'
    }

    const move = (e: MouseEvent) => {
      x = e.clientX
      y = e.clientY
      if (!inside) {
        inside = true
        rx = x
        ry = y
      }
      const t = e.target as Element | null
      if (t?.closest('input, textarea, select, [contenteditable]')) mode = 'text'
      else if (t?.closest('a, button, label, summary, [role="button"], [data-cursor]')) mode = 'link'
      else mode = 'default'
      apply()
    }
    const leave = () => { inside = false; apply() }
    const press = () => { down = true; apply() }
    const release = () => { down = false; apply() }

    const loop = () => {
      rx += (x - rx) * 0.16
      ry += (y - ry) * 0.16
      d.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
      r.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', press)
    window.addEventListener('mouseup', release)
    document.documentElement.addEventListener('mouseleave', leave)
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', press)
      window.removeEventListener('mouseup', release)
      document.documentElement.removeEventListener('mouseleave', leave)
    }
  }, [])

  return (
    <div className="print:hidden">
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-indigo-600 opacity-0 transition-[opacity,scale] duration-200"
      />
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[9998] opacity-0 transition-opacity duration-200"
      >
        <div
          ref={ringInner}
          className="h-9 w-9 rounded-full border-2 border-indigo-500/60 transition-all duration-200"
        />
      </div>
    </div>
  )
}