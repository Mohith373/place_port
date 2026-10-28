import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminStudents, { type Student } from '@/components/AdminStudents'
import Reveal from '@/components/Reveal'
import TiltCard from '@/components/TiltCard'
import CountUp from '@/components/CountUp'

const FIELDS = ['full_name', 'phone', 'branch', 'college', 'roll_no', 'batch_year', 'cgpa', 'bio', 'skills', 'linkedin', 'github']

const completeness = (p: Record<string, unknown>) =>
  Math.round((FIELDS.filter((k) => p[k] !== null && p[k] !== undefined && String(p[k]).trim() !== '').length / FIELDS.length) * 100)

const weekAgo = () => Date.now() - 7 * 24 * 60 * 60 * 1000

function count(items: string[]) {
  const m: Record<string, number> = {}
  items.forEach((k) => { m[k] = (m[k] || 0) + 1 })
  return Object.entries(m).sort((a, b) => b[1] - a[1])
}

function Bars({ data }: { data: [string, number][] }) {
  if (!data.length) return <p className="text-sm text-gray-500">No data yet</p>
  const max = Math.max(...data.map((d) => d[1]))
  return (
    <div className="space-y-2">
      {data.map(([label, n], i) => (
        <div key={label} className="flex items-center gap-2 text-sm">
          <span className="w-24 shrink-0 truncate">{label}</span>
          <div className="h-4 flex-1 rounded bg-gray-200">
            <div
              className="animate-grow h-4 rounded bg-gradient-to-r from-indigo-500 to-fuchsia-500"
              style={{ width: `${(n / max) * 100}%`, animationDelay: `${i * 90}ms` }}
            />
          </div>
          <span className="w-6 text-right font-semibold">{n}</span>
        </div>
      ))}
    </div>
  )
}

export default async function Admin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: me } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (me?.role !== 'admin') redirect('/dashboard')

  const { data } = await supabase
    .from('profiles').select('*').eq('role', 'student').order('created_at', { ascending: false })
  const rows = data ?? []

  const students: Student[] = rows.map((p) => ({
    id: p.id,
    name: p.full_name || '',
    email: p.email || '',
    username: p.username,
    branch: p.branch || '',
    college: p.college || '',
    batch: p.batch_year || '',
    cgpa: p.cgpa === null || p.cgpa === undefined ? '' : String(p.cgpa),
    skills: p.skills || '',
    views: p.views || 0,
    isPublic: !!p.is_public,
    complete: completeness(p),
  }))

  const cg = rows.map((p) => Number(p.cgpa)).filter((n) => !isNaN(n) && n > 0)
  const avg = cg.length ? cg.reduce((a, b) => a + b, 0) / cg.length : null
  const completed = students.filter((s) => s.complete >= 80).length
  const views = students.reduce((a, s) => a + s.views, 0)
  const cutoff = weekAgo()
  const newThisWeek = rows.filter((p) => new Date(p.created_at).getTime() >= cutoff).length

  const byBranch = count(students.map((s) => s.branch || 'Not set'))
  const topSkills = count(
    students.flatMap((s) => s.skills.split(',').map((x) => x.trim().toLowerCase()).filter(Boolean))
  ).slice(0, 8)

  const stats: { label: string; value: number | null; decimals?: number }[] = [
    { label: 'Total students', value: students.length },
    { label: 'Profiles ≥ 80% complete', value: completed },
    { label: 'Average CGPA', value: avg, decimals: 2 },
    { label: 'Portfolio views', value: views },
    { label: 'New this week', value: newThisWeek },
  ]

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <Reveal>
        <h1 className="text-2xl font-bold">Admin dashboard</h1>
      </Reveal>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 80}>
            <TiltCard className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-xl">
              <div className="text-3xl font-bold text-indigo-600">
                {s.value === null ? '–' : <CountUp value={s.value} decimals={s.decimals ?? 0} />}
              </div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Reveal>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 font-semibold">Students by branch</h2>
            <Bars data={byBranch} />
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 font-semibold">Top skills</h2>
            <Bars data={topSkills} />
          </div>
        </Reveal>
      </div>

      <Reveal>
        <AdminStudents students={students} />
      </Reveal>
    </main>
  )
}