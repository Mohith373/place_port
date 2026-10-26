'use client'
import { useMemo, useState } from 'react'

export type Student = {
  id: string
  name: string
  email: string
  username: string
  branch: string
  college: string
  batch: string
  cgpa: string
  skills: string
  views: number
  isPublic: boolean
  complete: number
}

const inputCls = 'rounded border border-gray-300 bg-white p-2 text-sm text-black'

export default function AdminStudents({ students }: { students: Student[] }) {
  const [q, setQ] = useState('')
  const [branch, setBranch] = useState('')
  const [minCgpa, setMinCgpa] = useState('')

  const branches = useMemo(
    () => Array.from(new Set(students.map((s) => s.branch).filter(Boolean))).sort(),
    [students]
  )

  const list = useMemo(() => {
    const term = q.toLowerCase().trim()
    const min = minCgpa === '' ? 0 : Number(minCgpa)
    return students.filter(
      (s) =>
        (!branch || s.branch === branch) &&
        (min === 0 || Number(s.cgpa) >= min) &&
        (!term || `${s.name} ${s.email} ${s.skills} ${s.college}`.toLowerCase().includes(term))
    )
  }, [students, q, branch, minCgpa])

  function exportCsv() {
    const header = ['Name', 'Email', 'Branch', 'College', 'Batch', 'CGPA', 'Skills', 'Profile complete %', 'Views', 'Public']
    const cell = (v: string | number) => {
      let s = String(v ?? '')
      if (/^[=+\-@]/.test(s)) s = "'" + s // stops spreadsheet formula injection
      return '"' + s.replace(/"/g, '""') + '"'
    }
    const rows = list.map((s) => [s.name, s.email, s.branch, s.college, s.batch, s.cgpa, s.skills, s.complete, s.views, s.isPublic ? 'Yes' : 'No'])
    const csv = [header, ...rows].map((r) => r.map(cell).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'students.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h2 className="mr-auto font-semibold">All students ({list.length})</h2>
        <input className={inputCls} placeholder="Search name, email, skill" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className={inputCls} value={branch} onChange={(e) => setBranch(e.target.value)}>
          <option value="">All branches</option>
          {branches.map((b) => <option key={b}>{b}</option>)}
        </select>
        <input className={`${inputCls} w-28`} type="number" step="0.1" min="0" max="10" placeholder="Min CGPA"
          value={minCgpa} onChange={(e) => setMinCgpa(e.target.value)} />
        <button onClick={exportCsv} className="rounded bg-indigo-600 px-3 py-2 text-sm text-white">Export CSV</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="p-2">Name</th><th className="p-2">Branch</th><th className="p-2">CGPA</th>
              <th className="p-2">Complete</th><th className="p-2">Views</th><th className="p-2">Public</th><th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id} className="border-b border-gray-200">
                <td className="p-2">
                  <div className="font-medium">{s.name || '(no name)'}</div>
                  <div className="text-xs text-gray-500">{s.email}</div>
                </td>
                <td className="p-2">{s.branch || '–'}</td>
                <td className="p-2">{s.cgpa || '–'}</td>
                <td className="p-2">{s.complete}%</td>
                <td className="p-2">{s.views}</td>
                <td className="p-2">{s.isPublic ? 'Yes' : 'No'}</td>
                <td className="p-2">
                  <a className="text-indigo-600 underline" href={`/p/${s.username}`} target="_blank" rel="noopener noreferrer">View</a>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan={7} className="p-4 text-center text-gray-500">No students match.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}