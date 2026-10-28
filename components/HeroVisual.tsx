'use client'
import { useCallback, useState } from 'react'
import dynamic from 'next/dynamic'
import HeroCard from '@/components/HeroCard'

const Hero3D = dynamic(() => import('@/components/Hero3D'), {
  ssr: false,
  loading: () => <HeroCard />,
})

export default function HeroVisual() {
  const [failed, setFailed] = useState(false)
  const handleFail = useCallback(() => setFailed(true), [])

  if (failed) return <HeroCard />
  return <Hero3D onFail={handleFail} />
}