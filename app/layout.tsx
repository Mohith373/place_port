import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import CursorEffect from '@/components/CursorEffect'
import ScrollProgress from '@/components/ScrollProgress'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'PlacePort – B.Tech Placement Portfolios',
  description: 'Build your B.Tech placement portfolio and share it with recruiters.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-screen antialiased`}>
        <ScrollProgress />
        <CursorEffect />
        <Navbar />
        {children}
      </body>
    </html>
  )
}