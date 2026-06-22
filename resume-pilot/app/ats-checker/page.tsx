"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ATSResultCard from "@/components/ATSResultCard";
import { calculateATSScore } from "@/lib/ats";
import { ATSResult } from "@/types/resume";

const sampleText = `Jane Smith
Email: jane.smith@example.com | Phone: +91 98765 43210 | LinkedIn: linkedin.com/in/janesmith

Education
Bachelor of Technology in Computer Science
Indian Institute of Technology, Delhi — 2020–2024 | GPA: 8.7/10

Skills
JavaScript, TypeScript, React, Node.js, Python, SQL, MongoDB, Git, REST APIs, Figma, Problem Solving, Communication

Experience
Software Engineer Intern — Google, Bangalore
June 2023 – August 2023
Developed and maintained React components for Google Search, improving page load time by 18%. Collaborated with a cross-functional team to implement a new feature that served 2 million daily active users. Built REST API endpoints using Node.js and integrated with internal microservices.

Projects
E-Commerce Platform | React, Node.js, MongoDB, Express
Built a full-stack e-commerce application with product listings, cart management, secure checkout, and admin panel. Deployed on Vercel with CI/CD using GitHub Actions.

AI Resume Analyzer | Python, Flask, OpenAI API
Created a tool that analyzes resumes for ATS compatibility and provides actionable improvement suggestions. Processed over 500 resumes during testing phase.

Certifications
AWS Certified Cloud Practitioner — 2024
Google Data Analytics Professional Certificate — 2023`;

export default function ATSCheckerPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<ATSResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [usedSample, setUsedSample] = useState(false);

  const handleCheck = async () => {
    if (!text.trim()) return;
    setChecking(true);
    await new Promise((r) => setTimeout(r, 600)); // Simulate processing
    setResult(calculateATSScore(text));
    setChecking(false);
  };

  const handleSample = () => {
    setText(sampleText);
    setUsedSample(true);
    setResult(null);
  };

  const handleClear = () => {
    setText("");
    setResult(null);
    setUsedSample(false);
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      {/* Page header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
            ATS Compatibility Checker
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Paste your resume text below to get an instant ATS score and targeted improvement suggestions.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left — input */}
          <div className="space-y-4">
            {/* Info card */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-blue-600">
                  <circle cx="8" cy="8" r="7"/>
                  <path d="M8 5v4M8 11h.01"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-800">How to use</p>
                <p className="text-xs text-blue-700 mt-0.5 leading-relaxed">
                  Copy your entire resume text (from any source — Word, PDF, Google Docs) and paste it below. The checker analyzes your content against common ATS criteria and scores each section.
                </p>
              </div>
            </div>

            {/* Textarea */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-slate-800" htmlFor="resume-text-input">
                  Resume Text
                </label>
                <div className="flex items-center gap-2">
                  {text && (
                    <span className="text-[11px] text-slate-400">{wordCount} words</span>
                  )}
                  {!usedSample ? (
                    <button
                      onClick={handleSample}
                      className="text-xs text-blue-600 font-medium hover:text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Use sample
                    </button>
                  ) : (
                    <button
                      onClick={handleClear}
                      className="text-xs text-slate-500 font-medium hover:text-slate-700 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
              <textarea
                id="resume-text-input"
                value={text}
                onChange={(e) => { setText(e.target.value); setResult(null); }}
                rows={18}
                placeholder="Paste your complete resume text here...

Include all sections:
- Contact info (name, email, phone, LinkedIn)
- Education
- Skills
- Work Experience
- Projects
- Certifications"
                className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-300 resize-none bg-slate-50 transition-shadow"
              />
              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleCheck}
                  disabled={!text.trim() || checking}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {checking ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8 2a6 6 0 100 12" strokeLinecap="round"/>
                      </svg>
                      Analyzing…
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="8" cy="8" r="7"/>
                        <path d="M5 8l2 2 4-4"/>
                      </svg>
                      Check ATS Score
                    </>
                  )}
                </button>
                {text && (
                  <button
                    onClick={handleClear}
                    className="px-4 py-3 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* What we check */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">What we analyse</h3>
              <div className="space-y-2">
                {[
                  { label: "Contact Information", desc: "Email, phone, LinkedIn URL", max: 20 },
                  { label: "Education", desc: "Degree, institution, graduation year", max: 20 },
                  { label: "Skills", desc: "Technical and soft skills", max: 20 },
                  { label: "Work Experience", desc: "Roles, companies, achievements", max: 20 },
                  { label: "Projects", desc: "Personal and academic projects", max: 15 },
                  { label: "Resume Length", desc: "Word count optimisation", max: 5 },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-slate-700">{item.label}</p>
                      <p className="text-[11px] text-slate-400">{item.desc}</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 shrink-0">{item.max} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — results */}
          <div className="space-y-4">
            {!result && !checking && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-slate-400">
                    <circle cx="14" cy="14" r="12"/>
                    <path d="M9 14l3.5 3.5 6.5-7"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-700">No results yet</h3>
                <p className="text-sm text-slate-400 mt-1 max-w-xs">
                  Paste your resume text and click "Check ATS Score" to see your results here.
                </p>
              </div>
            )}

            {checking && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                  <svg className="animate-spin w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2a10 10 0 100 20" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-700">Analysing your resume</h3>
                <p className="text-sm text-slate-400 mt-1">Checking all sections for ATS compatibility…</p>
              </div>
            )}

            {result && !checking && <ATSResultCard result={result} />}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
