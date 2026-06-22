import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="2" width="13" height="17" rx="2"/>
        <path d="M7 7h6M7 10.5h6M7 14h4"/>
        <path d="M17 8l2.5 2.5L17 13"/>
      </svg>
    ),
    title: "Smart Resume Builder",
    description: "Build polished resumes with a live preview. Fill in your details and watch your resume take shape instantly with professional templates.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="9"/>
        <path d="M11 6v5l3 3"/>
      </svg>
    ),
    title: "ATS Score Checker",
    description: "Paste your resume text and get an instant ATS compatibility score out of 100, with section-by-section analysis and improvement tips.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 16l5-5 4 4 5-7"/>
        <circle cx="19" cy="4" r="2"/>
      </svg>
    ),
    title: "Health Report",
    description: "See your resume completion percentage, strength rating, and exactly which sections are missing — all in one concise report.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="18" height="14" rx="2"/>
        <path d="M8 4v14M15 9h2M15 12h2"/>
      </svg>
    ),
    title: "3 Resume Templates",
    description: "Choose from Modern, Professional, or Minimal templates — each crafted to look great in both human and automated screening contexts.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 2v12M7 10l4 4 4-4M3 16v1a2 2 0 002 2h12a2 2 0 002-2v-1"/>
      </svg>
    ),
    title: "PDF Export",
    description: "Download your finished resume as a clean, print-ready PDF with a single click. No account required.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="18" height="16" rx="2"/>
        <path d="M7 8h8M7 12h5"/>
      </svg>
    ),
    title: "No Account Needed",
    description: "Everything runs entirely in your browser. Your data stays private — no sign-up, no servers, no paid APIs.",
  },
];

const steps = [
  { step: "01", title: "Fill Your Details", desc: "Enter your personal info, education, skills, experience, and projects into the guided form." },
  { step: "02", title: "Choose a Template", desc: "Pick from Modern, Professional, or Minimal — and watch the live preview update instantly." },
  { step: "03", title: "Check ATS Score", desc: "Run the ATS Checker to see how well your resume will fare against automated screening." },
  { step: "04", title: "Download as PDF", desc: "When you're satisfied, export a polished, print-ready PDF resume with one click." },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.1),transparent_60%)]" />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Free — No account required
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Builder</span>
            </h1>

            <p className="mt-5 text-xl font-medium text-slate-300" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Build Better Resumes. Get ATS Insights.
            </p>
            <p className="mt-3 text-base text-slate-400 leading-relaxed max-w-2xl">
              Create a professional resume in minutes with live preview, score your ATS compatibility instantly, and download a polished PDF — all without creating an account.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link
                href="/builder"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="2" y="1.5" width="10" height="13" rx="1.5"/>
                  <path d="M5 5h5M5 7.5h5M5 10h3"/>
                </svg>
                Start Building
              </Link>
              <Link
                href="/ats-checker"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-200 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="8" cy="8" r="7"/>
                  <path d="M5 8l2 2 4-4"/>
                </svg>
                Check ATS Score
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-white/10">
              {[
                { value: "100%", label: "Client-side" },
                { value: "3", label: "Templates" },
                { value: "0", label: "Sign-ups needed" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Everything you need
            </h2>
            <p className="mt-3 text-slate-500">
              ResumePilot packs all the tools students and job seekers need into a single, fast, privacy-first app.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors duration-200">
                  {f.icon}
                </div>
                <h3 className="mt-4 font-semibold text-slate-800">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
              How it works
            </h2>
            <p className="mt-3 text-slate-500">Four steps from blank form to polished, ATS-ready resume.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.step} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-full w-full h-px bg-slate-300 -translate-x-1/2 z-0" />
                )}
                <div className="relative z-10 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm h-full">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm mb-4">
                    {s.step}
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
            >
              Build your resume now
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 8h10M9 4l4 4-4 4"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
