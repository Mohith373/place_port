import Link from 'next/link'

const features = [
  { icon: '📝', title: 'Fill once', text: 'Enter your education, skills, projects and internships in one simple form.' },
  { icon: '🌐', title: 'Instant portfolio', text: 'A clean portfolio page is generated automatically with a link you can share.' },
  { icon: '📊', title: 'Placement dashboard', text: 'The placement cell sees statistics, filters students and exports lists.' },
]

const steps = ['Create your account', 'Fill in your resume details', 'Share your portfolio link with recruiters']

export default function Home() {
  return (
    <main>
      <section className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-4 py-16 text-center sm:py-24">
        <div className="mx-auto max-w-3xl">
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
            For B.Tech placements
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Your placement portfolio, <span className="text-indigo-600">built automatically</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
            Fill in your resume details once. PlacePort turns them into a shareable portfolio that recruiters can open on any device.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow hover:bg-indigo-700">
              Create my portfolio
            </Link>
            <Link href="/login" className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold hover:bg-gray-50">
              Login
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-4 py-14 md:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="text-3xl">{f.icon}</div>
            <h3 className="mt-3 text-lg font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{f.text}</p>
          </div>
        ))}
      </section>

      <section className="bg-white px-4 py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold">How it works</h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s} className="rounded-xl bg-gray-50 p-5 text-center">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">{i + 1}</div>
                <p className="mt-3 text-sm font-medium">{s}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="px-4 py-8 text-center text-sm text-gray-500">
        © PlacePort – B.Tech placement portfolio platform
      </footer>
    </main>
  )
}