'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Row = Record<string, string>
type Field = { key: string; label: string; area?: boolean }

const BRANCHES = ['CSE', 'IT', 'ECE', 'EEE', 'Mech', 'Civil', 'AI&ML', 'Other']
const inputCls = 'w-full rounded border border-gray-300 bg-white p-2 text-black'

const EDU: Field[] = [
  { key: 'level', label: 'Level (B.Tech / 12th / 10th)' },
  { key: 'institution', label: 'Institution' },
  { key: 'score', label: 'CGPA / Percentage' },
  { key: 'year', label: 'Year' },
]
const PROJ: Field[] = [
  { key: 'title', label: 'Project title' },
  { key: 'tech_stack', label: 'Tech stack' },
  { key: 'link', label: 'Link (GitHub / live)' },
  { key: 'description', label: 'Description', area: true },
]
const EXP: Field[] = [
  { key: 'company', label: 'Company' },
  { key: 'role', label: 'Role' },
  { key: 'duration', label: 'Duration' },
  { key: 'description', label: 'Description', area: true },
]

const v = (x: unknown) => (x == null ? '' : String(x))
const norm = (rows: Record<string, unknown>[], fields: Field[]): Row[] =>
  rows.map((r) => Object.fromEntries(fields.map((f) => [f.key, v(r[f.key])])))
const blank = (fields: Field[]): Row => Object.fromEntries(fields.map((f) => [f.key, '']))

function ListEditor({
  title, rows, setRows, fields,
}: { title: string; rows: Row[]; setRows: (r: Row[]) => void; fields: Field[] }) {
  const update = (i: number, key: string, value: string) =>
    setRows(rows.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)))

  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      {rows.map((row, i) => (
        <div key={i} className="grid gap-2 rounded border border-gray-200 bg-white p-3 shadow-sm sm:grid-cols-2">
          {fields.map((f) =>
            f.area ? (
              <textarea key={f.key} className={`${inputCls} sm:col-span-2`} placeholder={f.label}
                value={row[f.key] ?? ''} onChange={(e) => update(i, f.key, e.target.value)} />
            ) : (
              <input key={f.key} className={inputCls} placeholder={f.label}
                value={row[f.key] ?? ''} onChange={(e) => update(i, f.key, e.target.value)} />
            )
          )}
          <button type="button" className="text-left text-sm text-red-500 sm:col-span-2"
            onClick={() => setRows(rows.filter((_, idx) => idx !== i))}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="rounded border px-3 py-1 text-sm"
        onClick={() => setRows([...rows, blank(fields)])}>
        + Add
      </button>
    </section>
  )
}

export default function ProfileForm({
  userId, username, profile, education, projects, experience,
}: {
  userId: string
  username: string
  profile: Record<string, unknown>
  education: Record<string, unknown>[]
  projects: Record<string, unknown>[]
  experience: Record<string, unknown>[]
}) {
  const router = useRouter()
  const keys = ['full_name', 'phone', 'branch', 'college', 'roll_no', 'batch_year', 'cgpa',
    'linkedin', 'github', 'bio', 'skills', 'certifications', 'achievements']
  const [f, setF] = useState<Record<string, string>>(
    Object.fromEntries(keys.map((k) => [k, v(profile[k])]))
  )
  const [isPublic, setIsPublic] = useState(profile.is_public !== false)
  const [edu, setEdu] = useState<Row[]>(education.length ? norm(education, EDU) : [blank(EDU)])
  const [proj, setProj] = useState<Row[]>(projects.length ? norm(projects, PROJ) : [blank(PROJ)])
  const [exp, setExp] = useState<Row[]>(experience.length ? norm(experience, EXP) : [blank(EXP)])
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const set = (k: string, val: string) => setF({ ...f, [k]: val })

  const hasData = (r: Row) => Object.values(r).some((x) => x.trim() !== '')
  const checks: [string, boolean][] = [
    ['add your full name', !!f.full_name.trim()],
    ['add your phone number', !!f.phone.trim()],
    ['select your branch', !!f.branch],
    ['add your college', !!f.college.trim()],
    ['add your roll number', !!f.roll_no.trim()],
    ['add your batch year', !!f.batch_year.trim()],
    ['add your CGPA', !!f.cgpa.trim()],
    ['write an About section', !!f.bio.trim()],
    ['list your skills', !!f.skills.trim()],
    ['add LinkedIn or GitHub', !!(f.linkedin.trim() || f.github.trim())],
    ['add an education entry', edu.some(hasData)],
    ['add a project', proj.some(hasData)],
    ['add an internship or certification', exp.some(hasData) || !!f.certifications.trim()],
  ]
  const score = Math.round((checks.filter(([, ok]) => ok).length / checks.length) * 100)
  const tips = checks.filter(([, ok]) => !ok).slice(0, 3).map(([t]) => t)

  const text = (key: string, label: string, type = 'text') => (
    <label className="block text-sm font-medium">
      {label}
      <input type={type} className={`${inputCls} mt-1`} value={f[key]} onChange={(e) => set(key, e.target.value)} />
    </label>
  )
  const area = (key: string, label: string) => (
    <label className="block text-sm font-medium">
      {label}
      <textarea className={`${inputCls} mt-1 min-h-24`} value={f[key]} onChange={(e) => set(key, e.target.value)} />
    </label>
  )

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    const supabase = createClient()

    const { error: pErr } = await supabase
      .from('profiles')
      .update({
        full_name: f.full_name.trim(), phone: f.phone.trim(), branch: f.branch, college: f.college.trim(),
        roll_no: f.roll_no.trim(), batch_year: f.batch_year.trim(),
        cgpa: f.cgpa.trim() === '' ? null : Number(f.cgpa),
        linkedin: f.linkedin.trim(), github: f.github.trim(), bio: f.bio.trim(),
        skills: f.skills.trim(), certifications: f.certifications.trim(),
        achievements: f.achievements.trim(), is_public: isPublic,
      })
      .eq('id', userId)
    if (pErr) {
      setSaving(false)
      return setMsg('Error: ' + pErr.message)
    }

    const replaceRows = async (table: string, rows: Row[]) => {
      const del = await supabase.from(table).delete().eq('user_id', userId)
      if (del.error) return del.error.message
      const clean = rows.filter((r) => Object.values(r).some((x) => x.trim() !== ''))
      if (clean.length) {
        const ins = await supabase.from(table).insert(clean.map((r) => ({ ...r, user_id: userId })))
        if (ins.error) return ins.error.message
      }
      return null
    }

    const errors = (
      await Promise.all([replaceRows('education', edu), replaceRows('projects', proj), replaceRows('experience', exp)])
    ).filter(Boolean)

    setSaving(false)
    setMsg(errors.length ? 'Error: ' + errors.join(', ') : 'Saved!')
    router.refresh()
  }

  return (
    <form onSubmit={save} className="mt-6 space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>Profile strength</span>
          <span className={score >= 80 ? 'text-green-600' : 'text-indigo-600'}>{score}%</span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-3 rounded-full transition-all ${score >= 80 ? 'bg-green-500' : 'bg-indigo-500'}`}
            style={{ width: `${score}%` }}
          />
        </div>
        {tips.length > 0 ? (
          <p className="mt-2 text-xs text-gray-500">Next: {tips.join(' · ')}</p>
        ) : (
          <p className="mt-2 text-xs text-green-600">Great! Your profile is complete.</p>
        )}
      </div>

      <section className="grid gap-3 sm:grid-cols-2">
        {text('full_name', 'Full name')}
        {text('phone', 'Phone')}
        <label className="block text-sm font-medium">
          Branch
          <select className={`${inputCls} mt-1`} value={f.branch} onChange={(e) => set('branch', e.target.value)}>
            <option value="">Select</option>
            {BRANCHES.map((b) => <option key={b}>{b}</option>)}
          </select>
        </label>
        {text('college', 'College')}
        {text('roll_no', 'Roll number')}
        {text('batch_year', 'Batch (passing year)')}
        {text('cgpa', 'B.Tech CGPA', 'number')}
        {text('linkedin', 'LinkedIn URL')}
        {text('github', 'GitHub URL')}
      </section>

      {area('bio', 'About you')}
      {text('skills', 'Skills (comma separated, e.g. Python, Java, SQL)')}

      <ListEditor title="Education" rows={edu} setRows={setEdu} fields={EDU} />
      <ListEditor title="Projects" rows={proj} setRows={setProj} fields={PROJ} />
      <ListEditor title="Internships / Experience" rows={exp} setRows={setExp} fields={EXP} />

      {area('certifications', 'Certifications (one per line)')}
      {area('achievements', 'Achievements (one per line)')}

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
        Make my portfolio public (link: /p/{username})
      </label>

      <div className="flex items-center gap-3">
        <button disabled={saving} className="rounded bg-indigo-600 px-5 py-2 text-white disabled:opacity-60">
          {saving ? 'Saving...' : 'Save'}
        </button>
        {msg && <span className={msg.startsWith('Error') ? 'text-red-500' : 'text-green-600'}>{msg}</span>}
      </div>

      {msg === 'Saved!' && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm">
          <p className="font-semibold text-green-800">Your portfolio and resume are ready!</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <a className="rounded-lg bg-indigo-600 px-3 py-1.5 font-medium text-white" href={`/p/${username}`} target="_blank" rel="noopener noreferrer">View portfolio</a>
            <a className="rounded-lg bg-white px-3 py-1.5 font-medium text-gray-800 ring-1 ring-gray-300" href={`/resume/${username}`} target="_blank" rel="noopener noreferrer">View / download resume</a>
          </div>
        </div>
      )}
    </form>
  )
}