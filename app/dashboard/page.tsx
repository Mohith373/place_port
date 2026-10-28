import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProfileForm from '@/components/ProfileForm'
import ShareCard from '@/components/ShareCard'
import AtsChecker from '@/components/AtsChecker'
import PhotoUpload from '@/components/PhotoUpload'
import Reveal from '@/components/Reveal'

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

  const resumeText = [
    profile.bio, profile.skills, profile.certifications, profile.achievements,
    ...(education.data ?? []).map((e) => `${e.level} ${e.institution}`),
    ...(projects.data ?? []).map((x) => `${x.title} ${x.tech_stack} ${x.description}`),
    ...(experience.data ?? []).map((x) => `${x.role} ${x.company} ${x.description}`),
  ].filter(Boolean).join('\n')

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <Reveal>
        <h1 className="text-2xl font-bold">My portfolio details</h1>
        <p className="text-sm text-gray-500">Fill in your details and click Save. Your portfolio and resume update instantly.</p>
      </Reveal>

      <Reveal delay={80}>
        <ShareCard username={profile.username} isPublic={!!profile.is_public} />
      </Reveal>

      <Reveal delay={160}>
        <PhotoUpload userId={user.id} photoUrl={profile.photo_url} name={profile.full_name || ''} />
      </Reveal>

      <Reveal delay={240}>
        <ProfileForm
          userId={user.id}
          username={profile.username}
          profile={profile}
          education={education.data ?? []}
          projects={projects.data ?? []}
          experience={experience.data ?? []}
        />
      </Reveal>

      <Reveal>
        <AtsChecker resumeText={resumeText} />
      </Reveal>
    </main>
  )
}