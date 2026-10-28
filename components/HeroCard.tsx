'use client'
import { useRef } from 'react'

const qr = [
  1,1,1,0,1,1,1, 1,0,1,0,1,0,1, 1,1,1,1,1,1,1, 0,1,0,1,0,0,1, 1,0,1,1,1,0,0, 0,1,1,0,1,1,1, 1,1,1,0,0,1,0,
]

export default function HeroCard() {
  const stage = useRef<HTMLDivElement>(null)
  const card = useRef<HTMLDivElement>(null)

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const s = stage.current
    const c = card.current
    if (!s || !c) return
    const b = s.getBoundingClientRect()
    const px = (e.clientX - b.left) / b.width - 0.5
    const py = (e.clientY - b.top) / b.height - 0.5
    c.style.transform = `rotateX(${-py * 22}deg) rotateY(${px * 28}deg)`
  }

  function onLeave() {
    if (card.current) card.current.style.transform = 'rotateX(0deg) rotateY(0deg)'
  }

  return (
    <div
      ref={stage}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="flex h-full w-full items-center justify-center"
      style={{ perspective: '1100px' }}
    >
      <div className="animate-float">
        <div
          ref={card}
          className="relative w-72 rounded-3xl bg-white p-5 shadow-2xl shadow-indigo-300/50 ring-1 ring-gray-100 transition-transform duration-200 sm:w-80"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="h-16 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500" />

          <div className="-mt-8 flex items-end gap-3 px-2" style={{ transform: 'translateZ(40px)', transformStyle: 'preserve-3d' }}>
            <div className="h-16 w-16 rounded-full border-4 border-white bg-indigo-200 shadow-lg" />
            <div className="pb-1">
              <div className="h-3 w-28 rounded bg-gray-800" />
              <div className="mt-2 h-2 w-20 rounded bg-gray-300" />
            </div>
          </div>

          <div className="mt-5 space-y-2 px-2">
            <div className="h-2 w-full rounded bg-gray-200" />
            <div className="h-2 w-5/6 rounded bg-gray-200" />
            <div className="h-2 w-2/3 rounded bg-gray-200" />
          </div>

          <div className="mt-4 flex flex-wrap gap-2 px-2" style={{ transform: 'translateZ(55px)' }}>
            {['Python', 'React', 'SQL'].map((s) => (
              <span key={s} className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 shadow">
                {s}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between px-2">
            <div className="w-28">
              <div className="text-[10px] font-semibold text-gray-500">Profile strength</div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
                <div className="h-2 w-[92%] rounded-full bg-green-500" />
              </div>
            </div>
            <div
              className="grid grid-cols-7 gap-[2px] rounded-lg bg-white p-1 shadow-lg ring-1 ring-gray-200"
              style={{ transform: 'translateZ(80px)' }}
            >
              {qr.map((on, i) => (
                <div key={i} className={`h-[6px] w-[6px] ${on ? 'bg-gray-900' : 'bg-white'}`} />
              ))}
            </div>
          </div>

          <div
            className="absolute -right-5 -top-5 rounded-2xl bg-white px-3 py-2 text-xs font-bold text-green-600 shadow-xl ring-1 ring-gray-100"
            style={{ transform: 'translateZ(100px)' }}
          >
            ✓ Resume ready
          </div>
        </div>
      </div>
    </div>
  )
}