import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PortfolioActions from '@/components/PortfolioActions'

type Props = { params: Promise<{ username: string }> }

const lines = (s: string | null) => (s ?? '').split('\n').map((x) => x.trim()).filter(Boolean)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const supabase = await createClient()
  const { data: p } = await supabase.from('profiles').select('full_name').eq('username', username).maybeSingle()
  return { title: p ? `${p.full_name} – Resume` : 'Resume not found' }
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h2 className="border-b border-gray-400 pb-1 text-sm font-bold uppercase tracking-wider">{title}</h2>
      <div className="mt-2 space-y-2 text-sm">{children}</div>
    </section>
  )
}

export default async function Resume({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()

  const { data: p } = await supabase.from('profiles').select('*').eq('username', username).maybeSingle()
  if (!p) notFound()

  const [edu, proj, exp] = await Promise.all([
    supabase.from('education').select('*').eq('user_id', p.id),
    supabase.from('projects').select('*').eq('user_id', p.id),
    supabase.from('experience').select('*').eq('user_id', p.id),
  ])

  const skills = (p.skills ?? '').split(',').map((s: string) => s.trim()).filter(Boolean)
  const certs = lines(p.certifications)
  const achievements = lines(p.achievements)
  const contact = [p.email, p.phone, p.linkedin, p.github].filter(Boolean)

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6 text-gray-900 print:bg-white print:p-0">
      <div className="mx-auto max-w-3xl">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 print:hidden">
          <Link href={`/p/${username}`} className="text-sm font-medium text-indigo-600">← View portfolio</Link>
          <PortfolioActions />
        </div>

        <article className="rounded-lg border bg-white p-6 shadow-sm sm:p-10 print:border-0 print:shadow-none">
          <header className="text-center">
            <h1 className="text-3xl font-bold">{p.full_name || username}</h1>
            <p className="mt-1 text-sm text-gray-700">
              {[p.branch && `B.Tech ${p.branch}`, p.college, p.batch_year && `Batch ${p.batch_year}`, p.cgpa && `CGPA ${p.cgpa}`]
                .filter(Boolean).join(' | ')}
            </p>
            {contact.length > 0 && <p className="mt-1 break-words text-sm text-gray-700">{contact.join(' | ')}</p>}
          </header>

          {p.bio && <Block title="Summary"><p>{p.bio}</p></Block>}

          {(edu.data ?? []).length > 0 && (
            <Block title="Education">
              {edu.data!.map((e) => (
                <div key={e.id} className="flex flex-wrap justify-between gap-x-4">
                  <div><span className="font-semibold">{e.institution}</span> – {e.level}</div>
                  <div className="text-gray-600">{[e.score, e.year].filter(Boolean).join(' | ')}</div>
                </div>
              ))}
            </Block>
          )}

          {skills.length > 0 && <Block title="Skills"><p>{skills.join(' • ')}</p></Block>}

          {(proj.data ?? []).length > 0 && (
            <Block title="Projects">
              {proj.data!.map((x) => (
                <div key={x.id}>
                  <div className="font-semibold">{x.title}{x.tech_stack && <span className="font-normal text-gray-600"> | {x.tech_stack}</span>}</div>
                  {x.description && <p>{x.description}</p>}
                  {x.link && <p className="break-all text-gray-600">{x.link}</p>}
                </div>
              ))}
            </Block>
          )}

          {(exp.data ?? []).length > 0 && (
            <Block title="Experience">
              {exp.data!.map((x) => (
                <div key={x.id}>
                  <div className="flex flex-wrap justify-between gap-x-4">
                    <span className="font-semibold">{x.role} – {x.company}</span>
                    <span className="text-gray-600">{x.duration}</span>
                  </div>
                  {x.description && <p>{x.description}</p>}
                </div>
              ))}
            </Block>
          )}

          {certs.length > 0 && <Block title="Certifications"><ul className="list-disc pl-5">{certs.map((c, i) => <li key={i}>{c}</li>)}</ul></Block>}
          {achievements.length > 0 && <Block title="Achievements"><ul className="list-disc pl-5">{achievements.map((c, i) => <li key={i}>{c}</li>)}</ul></Block>}
        </article>
      </div>
    </main>
  )
}