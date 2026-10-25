'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignOut() {
  const router = useRouter()
  return (
    <button
      className="rounded border px-3 py-1"
      onClick={async () => {
        await createClient().auth.signOut()
        router.push('/')
        router.refresh()
      }}
    >
      Sign out
    </button>
  )
}