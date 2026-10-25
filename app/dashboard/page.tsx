import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SignOut from '@/components/SignOut'
import ProfileForm from '@/components/ProfileForm'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/login')
  if (profile.role === 'admin') redirect('/admin')

  const [education, projects, experience] = await Promise.all([
    supabase.from('education').select('*').eq('user_id', user.id),
    supabase.from('projects').select('*').eq('user_id', user.id),
    supabase.from('experience').select('*').eq('user_id', user.id),
  ])

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My portfolio details</h1>
        <SignOut />
      </div>
      <p className="mt-1 text-sm text-gray-500">Your portfolio link: /p/{profile.username}</p>
      <ProfileForm
        userId={user.id}
        username={profile.username}
        profile={profile}
        education={education.data ?? []}
        projects={projects.data ?? []}
        experience={experience.data ?? []}
      />
    </main>
  )
}