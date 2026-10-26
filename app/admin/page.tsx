import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SignOut from '@/components/SignOut'
import AdminStudents, { type Student } from '@/components/AdminStudents'

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
      {data.map(([label, n]) => (
        <div key={label} className="flex items-center gap-2 text-sm">
          <span className="w-24 shrink-0 truncate">{label}</span>
          <div className="h-4 flex-1 rounded bg-gray-200">
            <div className="h-4 rounded bg-indigo-500" style={{ width: `${(n / max) * 100}%` }} />
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
  const avg = cg.length ? (cg.reduce((a, b) => a + b, 0) / cg.length).toFixed(2) : '–'
  const completed = students.filter((s) => s.complete >= 80).length
  const views = students.reduce((a, s) => a + s.views, 0)
  const cutoff = weekAgo()
  const newThisWeek = rows.filter((p) => new Date(p.created_at).getTime() >= cutoff).length

  const byBranch = count(students.map((s) => s.branch || 'Not set'))
  const topSkills = count(
    students.flatMap((s) => s.skills.split(',').map((x) => x.trim().toLowerCase()).filter(Boolean))
  ).slice(0, 8)

  const stats: [string, string | number][] = [
    ['Total students', students.length],
    ['Profiles ≥ 80% complete', completed],
    ['Average CGPA', avg],
    ['Portfolio views', views],
    ['New this week', newThisWeek],
  ]

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin dashboard</h1>
        <SignOut />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
            <div className="text-3xl font-bold text-indigo-600">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
          <h2 className="mb-3 font-semibold">Students by branch</h2>
          <Bars data={byBranch} />
        </div>
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
          <h2 className="mb-3 font-semibold">Top skills</h2>
          <Bars data={topSkills} />
        </div>
      </div>

      <AdminStudents students={students} />
    </main>
  )
}