import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import PortfolioActions from '@/components/PortfolioActions'

type Props = { params: Promise<{ username: string }> }

const href = (u: string) => (/^https?:\/\//i.test(u) ? u : `https://${u}`)
const lines = (s: string | null) => (s ?? '').split('\n').map((x) => x.trim()).filter(Boolean)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const supabase = await createClient()
  const { data: p } = await supabase
    .from('profiles').select('full_name, branch, college, bio').eq('username', username).maybeSingle()
  if (!p) return { title: 'Portfolio not found' }
  return {
    title: `${p.full_name} – B.Tech Portfolio`,
    description: p.bio?.slice(0, 150) || `${p.branch ?? ''} ${p.college ?? ''}`.trim(),
  }
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t px-8 py-5">
      <h2 className="mb-3 text-lg font-semibold text-indigo-600">{title}</h2>
      {children}
    </section>
  )
}

export default async function Portfolio({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()

  // RLS hides private profiles from everyone except the owner and admins
  const { data: p } = await supabase.from('profiles').select('*').eq('username', username).maybeSingle()
  if (!p) notFound()

  const [edu, proj, exp] = await Promise.all([
    supabase.from('education').select('*').eq('user_id', p.id),
    supabase.from('projects').select('*').eq('user_id', p.id),
    supabase.from('experience').select('*').eq('user_id', p.id),
  ])

  // Count a view unless the owner is looking at their own page
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.id !== p.id) {
    await supabase.rpc('increment_views', { uname: username })
  }

  const skills = (p.skills ?? '').split(',').map((s: string) => s.trim()).filter(Boolean)
  const certs = lines(p.certifications)
  const achievements = lines(p.achievements)

  return (
    <main className="min-h-screen bg-gray-100 p-4 text-gray-900 print:bg-white print:p-0">
      <div className="mx-auto max-w-3xl">
        <PortfolioActions />
        <article className="overflow-hidden rounded-2xl border bg-white print:border-0">
          <header className="bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-8 text-white">
            <h1 className="text-3xl font-bold">{p.full_name || username}</h1>
            <p className="mt-1">
              {[p.branch && `B.Tech ${p.branch}`, p.college].filter(Boolean).join(' · ')}
            </p>
            <p className="text-sm opacity-90">
              {[p.batch_year && `Batch ${p.batch_year}`, p.cgpa && `CGPA ${p.cgpa}`, p.roll_no && `Roll ${p.roll_no}`]
                .filter(Boolean).join(' · ')}
            </p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm font-medium">
              {p.linkedin && <a className="underline" href={href(p.linkedin)} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
              {p.github && <a className="underline" href={href(p.github)} target="_blank" rel="noopener noreferrer">GitHub</a>}
              {p.email && <a className="underline" href={`mailto:${p.email}`}>{p.email}</a>}
              {p.phone && <span>{p.phone}</span>}
            </div>
          </header>

          {p.bio && <Section title="About"><p>{p.bio}</p></Section>}

          {skills.length > 0 && (
            <Section title="Skills">
              <div className="flex flex-wrap gap-2">
                {skills.map((s: string) => (
                  <span key={s} className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">{s}</span>
                ))}
              </div>
            </Section>
          )}

          {(edu.data ?? []).length > 0 && (
            <Section title="Education">
              {edu.data!.map((e) => (
                <div key={e.id} className="mb-3">
                  <div className="font-semibold">{e.level} – {e.institution}</div>
                  <div className="text-sm text-gray-500">{[e.score, e.year].filter(Boolean).join(' · ')}</div>
                </div>
              ))}
            </Section>
          )}

          {(proj.data ?? []).length > 0 && (
            <Section title="Projects">
              {proj.data!.map((x) => (
                <div key={x.id} className="mb-4">
                  <div className="font-semibold">
                    {x.title}{' '}
                    {x.link && <a className="text-indigo-600" href={href(x.link)} target="_blank" rel="noopener noreferrer">↗</a>}
                  </div>
                  {x.tech_stack && <div className="text-sm text-gray-500">{x.tech_stack}</div>}
                  {x.description && <p className="mt-1">{x.description}</p>}
                </div>
              ))}
            </Section>
          )}

          {(exp.data ?? []).length > 0 && (
            <Section title="Experience">
              {exp.data!.map((x) => (
                <div key={x.id} className="mb-4">
                  <div className="font-semibold">{x.role} at {x.company}</div>
                  {x.duration && <div className="text-sm text-gray-500">{x.duration}</div>}
                  {x.description && <p className="mt-1">{x.description}</p>}
                </div>
              ))}
            </Section>
          )}

          {certs.length > 0 && (
            <Section title="Certifications"><ul className="list-disc pl-5">{certs.map((c, i) => <li key={i}>{c}</li>)}</ul></Section>
          )}
          {achievements.length > 0 && (
            <Section title="Achievements"><ul className="list-disc pl-5">{achievements.map((c, i) => <li key={i}>{c}</li>)}</ul></Section>
          )}
        </article>
      </div>
    </main>
  )
}