'use client'
import { useMemo, useState } from 'react'

// [skill name, other ways it is written]
const SKILLS: [string, string[]][] = [
  ['python', []], ['java', []], ['javascript', ['js']], ['typescript', []], ['c++', ['cpp']], ['c#', []],
  ['html', []], ['css', []], ['react', ['reactjs', 'react.js']], ['angular', []], ['vue', ['vue.js']],
  ['next.js', ['nextjs']], ['node.js', ['nodejs', 'node']], ['express', ['express.js']], ['django', []],
  ['flask', []], ['spring boot', ['springboot']], ['sql', []], ['mysql', []], ['postgresql', ['postgres']],
  ['mongodb', ['mongo']], ['firebase', []], ['supabase', []], ['aws', []], ['azure', []], ['gcp', ['google cloud']],
  ['docker', []], ['kubernetes', ['k8s']], ['git', []], ['github', []], ['linux', []],
  ['rest api', ['rest apis', 'restful', 'rest']], ['graphql', []], ['machine learning', ['ml']],
  ['deep learning', []], ['tensorflow', []], ['pytorch', []], ['pandas', []], ['numpy', []],
  ['scikit-learn', ['sklearn']], ['data structures', ['dsa']], ['algorithms', []],
  ['oop', ['oops', 'object oriented', 'object-oriented']], ['dbms', ['database management']],
  ['operating systems', []], ['computer networks', ['networking']], ['system design', []],
  ['agile', []], ['scrum', []], ['ci/cd', ['cicd']], ['jenkins', []], ['tailwind', ['tailwind css']],
  ['bootstrap', []], ['redux', []], ['android', []], ['kotlin', []], ['flutter', []],
  ['react native', []], ['swift', []], ['php', []], ['laravel', []], ['excel', []], ['power bi', ['powerbi']],
  ['tableau', []], ['data analysis', ['data analytics']], ['nlp', ['natural language processing']],
  ['computer vision', []], ['opencv', []], ['iot', []], ['embedded c', []], ['arduino', []], ['matlab', []],
  ['autocad', []], ['solidworks', []], ['verilog', []], ['vhdl', []], ['cybersecurity', ['cyber security']],
  ['selenium', []], ['testing', []], ['junit', []], ['jira', []], ['figma', []],
  ['communication', []], ['teamwork', ['team work']], ['problem solving', ['problem-solving']], ['leadership', []],
]

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const has = (text: string, term: string) =>
  new RegExp(`(^|[^a-z0-9+#])${esc(term)}($|[^a-z0-9+#])`).test(text)

function found(text: string) {
  const t = text.toLowerCase()
  return SKILLS.filter(([name, aliases]) => [name, ...aliases].some((x) => has(t, x))).map(([name]) => name)
}

export default function AtsChecker({ resumeText }: { resumeText: string }) {
  const [jd, setJd] = useState('')

  const result = useMemo(() => {
    if (jd.trim().length < 20) return null
    const need = found(jd)
    const have = new Set(found(resumeText))
    const matched = need.filter((n) => have.has(n))
    const missing = need.filter((n) => !have.has(n))
    const score = need.length ? Math.round((matched.length / need.length) * 100) : 0
    return { need, matched, missing, score }
  }, [jd, resumeText])

  const tone = !result ? '' : result.score >= 70 ? 'text-green-600' : result.score >= 40 ? 'text-amber-600' : 'text-red-600'
  const label = !result ? '' : result.score >= 70 ? 'Strong match' : result.score >= 40 ? 'Moderate match' : 'Low match'

  return (
    <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold">Resume match checker</h2>
      <p className="mt-1 text-sm text-gray-500">
        Paste a job description to see how well your saved profile matches it. Save your profile first, because this uses your saved data.
      </p>
      <textarea
        className="mt-3 min-h-32 w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-black"
        placeholder="Paste the job description here..."
        value={jd}
        onChange={(e) => setJd(e.target.value)}
      />

      {result && result.need.length === 0 && (
        <p className="mt-3 text-sm text-gray-600">
          No known skills were found in this text. Paste the full job description, including the requirements section.
        </p>
      )}

      {result && result.need.length > 0 && (
        <div className="mt-4">
          <div className="flex items-end gap-3">
            <div className={`text-4xl font-extrabold ${tone}`}>{result.score}%</div>
            <div className={`pb-1 text-sm font-semibold ${tone}`}>{label}</div>
          </div>
          <p className="text-xs text-gray-500">{result.matched.length} of {result.need.length} skills in the job description are on your profile</p>

          {result.matched.length > 0 && (
            <div className="mt-3">
              <div className="text-sm font-medium">You have</div>
              <div className="mt-1 flex flex-wrap gap-2">
                {result.matched.map((s) => (
                  <span key={s} className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">{s}</span>
                ))}
              </div>
            </div>
          )}
          {result.missing.length > 0 && (
            <div className="mt-3">
              <div className="text-sm font-medium">Missing – add these if you really have them</div>
              <div className="mt-1 flex flex-wrap gap-2">
                {result.missing.map((s) => (
                  <span key={s} className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}