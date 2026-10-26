'use client'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// crop to a centred square and shrink to 400x400 JPEG
function resizeToBlob(file: File, size = 400): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const side = Math.min(img.width, img.height)
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        URL.revokeObjectURL(url)
        return reject(new Error('Image processing not supported'))
      }
      ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size)
      URL.revokeObjectURL(url)
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not process image'))), 'image/jpeg', 0.85)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('That file is not a valid image'))
    }
    img.src = url
  })
}

export default function PhotoUpload({
  userId, photoUrl, name,
}: { userId: string; photoUrl: string | null; name: string }) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [url, setUrl] = useState(photoUrl ?? '')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) return setMsg('Error: please choose an image file')
    if (file.size > 10 * 1024 * 1024) return setMsg('Error: image is too large (max 10 MB)')

    setBusy(true)
    setMsg('')
    try {
      const blob = await resizeToBlob(file)
      const supabase = createClient()
      const path = `${userId}/avatar.jpg`

      const { error: upErr } = await supabase.storage
        .from('avatars')
        .upload(path, blob, { upsert: true, contentType: 'image/jpeg', cacheControl: '3600' })
      if (upErr) throw upErr

      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      const publicUrl = `${data.publicUrl}?v=${Date.now()}`

      const { error: dbErr } = await supabase.from('profiles').update({ photo_url: publicUrl }).eq('id', userId)
      if (dbErr) throw dbErr

      setUrl(publicUrl)
      setMsg('Photo updated!')
      router.refresh()
    } catch (err) {
      setMsg('Error: ' + (err instanceof Error ? err.message : 'upload failed'))
    }
    setBusy(false)
  }

  async function remove() {
    setBusy(true)
    setMsg('')
    const supabase = createClient()
    await supabase.storage.from('avatars').remove([`${userId}/avatar.jpg`])
    const { error } = await supabase.from('profiles').update({ photo_url: null }).eq('id', userId)
    if (error) setMsg('Error: ' + error.message)
    else {
      setUrl('')
      setMsg('Photo removed')
      router.refresh()
    }
    setBusy(false)
  }

  return (
    <div className="mt-4 flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="Profile photo" className="h-20 w-20 rounded-full border object-cover" />
      ) : (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-3xl font-bold text-indigo-600">
          {(name || '?').charAt(0).toUpperCase()}
        </div>
      )}
      <div>
        <div className="font-semibold">Profile photo</div>
        <p className="text-xs text-gray-500">Shown on your public portfolio. JPG, PNG or WebP.</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
          <button type="button" disabled={busy} onClick={() => inputRef.current?.click()}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60">
            {busy ? 'Working...' : url ? 'Change photo' : 'Upload photo'}
          </button>
          {url && (
            <button type="button" disabled={busy} onClick={remove}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-60">
              Remove
            </button>
          )}
          {msg && <span className={msg.startsWith('Error') ? 'text-sm text-red-500' : 'text-sm text-green-600'}>{msg}</span>}
        </div>
      </div>
    </div>
  )
}