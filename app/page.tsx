import Link from 'next/link'
import Reveal from '@/components/Reveal'
import TiltCard from '@/components/TiltCard'
import Parallax from '@/components/Parallax'
import HeroVisual from '@/components/HeroVisual'

const features = [
  { icon: '📝', title: 'Fill once', text: 'Enter your education, skills, projects and internships in one simple form.' },
  { icon: '🌐', title: 'Instant portfolio', text: 'A clean portfolio page is generated automatically with a link you can share.' },
  { icon: '📄', title: 'Ready resume', text: 'A one-page ATS-style resume you can download as a PDF in one click.' },
  { icon: '📊', title: 'Placement dashboard', text: 'The placement cell sees statistics, filters students and exports lists.' },
]

const steps = [
  { t: 'Create your account', d: 'Sign up with your email and a strong password.' },
  { t: 'Fill in your details', d: 'Education, skills, projects, internships and a photo.' },
  { t: 'Share your link', d: 'Send your portfolio link or QR code to recruiters.' },
  { t: 'Track your reach', d: 'See how many people viewed your portfolio.' },
]

const skills = ['Python', 'Java', 'React', 'Node.js', 'SQL', 'C++', 'Machine Learning', 'Cloud', 'DSA', 'Git', 'Django', 'TypeScript']

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-4 py-16 sm:py-24">
        <Parallax speed={0.12} className="absolute -left-10 top-10">
          <div className="animate-float h-56 w-56 rounded-full bg-indigo-300/40 blur-3xl" />
        </Parallax>
        <Parallax speed={-0.08} className="absolute -right-10 bottom-0">
          <div className="animate-float-slow h-64 w-64 rounded-full bg-violet-300/40 blur-3xl" />
        </Parallax>

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <Reveal>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                For B.Tech placements
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl">
                Your placement portfolio,{' '}
                <span className="animate-gradient bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
                  built automatically
                </span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-4 max-w-xl text-lg text-gray-600 lg:max-w-lg">
                Fill in your resume details once. PlacePort turns them into a shareable portfolio and a downloadable resume that recruiters can open on any device.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <Link href="/signup" className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700">
                  Create my portfolio
                </Link>
                <Link href="/login" className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold hover:bg-gray-50">
                  Login
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="relative h-80 sm:h-96 lg:h-[28rem]">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* SCROLLING SKILLS STRIP */}
      <section className="overflow-hidden border-y border-gray-200 bg-white py-4">
        <div className="animate-marquee flex w-max gap-3">
          {[...skills, ...skills].map((s, i) => (
            <span key={i} className="rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-700">
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <Reveal>
          <h2 className="text-center text-3xl font-bold">Everything a placement profile needs</h2>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 110}>
              <TiltCard className="h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-xl">
                <div className="text-3xl">{f.icon}</div>
                <h3 className="mt-3 text-lg font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{f.text}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* STICKY SCROLL SECTION */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <h2 className="text-3xl font-bold">How it works</h2>
              <p className="mt-3 text-gray-600">Four quick steps from sign-up to a portfolio recruiters can open on their phone.</p>
              <Link href="/signup" className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white">
                Get started
              </Link>
            </Reveal>
          </div>
          <ol className="space-y-5">
            {steps.map((s, i) => (
              <li key={s.t}>
                <Reveal delay={i * 80}>
                  <div className="flex gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-6 transition hover:-translate-y-1 hover:shadow-lg">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">{i + 1}</div>
                    <div>
                      <h3 className="font-semibold">{s.t}</h3>
                      <p className="mt-1 text-sm text-gray-600">{s.d}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="px-4 py-16">
        <Reveal>
          <div className="animate-gradient mx-auto max-w-4xl rounded-3xl bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-indigo-600 p-10 text-center text-white shadow-xl">
            <h2 className="text-3xl font-bold">Ready to stand out in placements?</h2>
            <p className="mt-2 text-indigo-100">Build your portfolio in a few minutes.</p>
            <Link href="/signup" className="mt-6 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-indigo-700">
              Create my portfolio
            </Link>
          </div>
        </Reveal>
      </section>

      <footer className="px-4 pb-8 text-center text-sm text-gray-500">
        © PlacePort – B.Tech placement portfolio platform
      </footer>
    </main>
  )
}