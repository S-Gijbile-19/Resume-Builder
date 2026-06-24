"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
    title: "Smart Split Workspace",
    description: "Build premium resumes with an interactive side-by-side editor panel matrix view. Watch mutations update instantaneously.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "ATS Compatibility Scan",
    description: "Evaluates standard textual structure densities dynamically to output comprehensive rating insights up to 100 on the fly.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: "Document Health Metrics",
    description: "Tracks active data field completion percentages, component alignment strength parameters, and critical missing block warnings.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#030712] text-slate-100 relative overflow-x-hidden selection:bg-blue-500/30">

      {/* Radiant Mesh Background Aura Elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-600/[0.03] blur-[140px]" />
        <div className="absolute bottom-[20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/[0.03] blur-[140px]" />
      </div>

      <Navbar />

      {/* Hero Display Layer */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-36 border-b border-slate-900/60 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide backdrop-blur-md mb-8 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" /> Sandbox Core Running — Zero Accounts Mandatory
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">
              Forge Premium Resumes. <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                Unlock ATS Intelligence.
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed">
              An engineering-oriented workflow console designed to accelerate career placement data curation. Fill out technical specifications side-by-side with localized live vector parsing output pipelines cleanly.
            </p>

            <div className="pt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/builder"
                className="px-8 py-4 text-sm font-bold text-slate-950 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-xl hover:opacity-95 transition-all shadow-lg active:scale-[0.99] flex items-center gap-2"
              >
                Start Building Now
              </Link>
              <Link
                href="/ats-checker"
                className="px-8 py-4 text-sm font-bold text-slate-200 border border-slate-800 bg-slate-900/40 backdrop-blur-md rounded-xl hover:bg-slate-800 transition-all active:scale-[0.99]"
              >
                Direct Score Checker
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Utilities Section Overview */}
      <section className="py-24 bg-transparent relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, idx) => (
              <div key={idx} className="p-7 rounded-2xl border border-slate-900 bg-[#090f1c]/30 backdrop-blur-xl shadow-2xl">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  {f.icon}
                </div>
                <h3 className="mt-5 font-bold text-slate-200 tracking-wide">{f.title}</h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}