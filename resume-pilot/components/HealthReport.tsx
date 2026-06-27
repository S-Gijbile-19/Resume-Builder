"use client";

import { ResumeData } from "@/types/resume";
import { calculateCompletion, getResumeStrength, getMissingSections } from "@/lib/ats";

interface Props {
  data: ResumeData;
  atsScore: number;
}

export default function HealthReport({ data, atsScore }: Props) {
  const completion = calculateCompletion(data);
  const strength = getResumeStrength(atsScore, completion);
  const missing = getMissingSections(data);

  const strengthConfig = {
    Weak: { color: "text-red-600", bg: "bg-red-50 border-red-200", bar: "bg-red-500", desc: "Add more sections and detail." },
    Good: { color: "text-amber-600", bg: "bg-amber-50 border-amber-200", bar: "bg-amber-500", desc: "A few more improvements will help." },
    Strong: { color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", bar: "bg-emerald-500", desc: "Resume is well-structured." },
  };
  const sc = strengthConfig[strength];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4 shrink-0">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Resume Analytics</h2>
        {missing.length === 0 && (
          <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M2.5 7l3 3 6-6" />
            </svg>
            Complete
          </div>
        )}
      </div>

      {/* Grid wrapper makes layout responsive and flat instead of taking huge vertical height */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">

        {/* Progress 1: Completion */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-slate-500">Profile Completion</span>
            <span className="font-bold text-blue-600">{completion}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>

        {/* Progress 2: ATS Tracker */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-slate-500">ATS Score Rating</span>
            <span className="font-bold text-slate-700">{atsScore > 0 ? `${atsScore}/100` : "Run checker"}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
              style={{ width: `${atsScore}%` }}
            />
          </div>
        </div>

        {/* Dynamic Compact Strength Metric Box */}
        <div className={`rounded-xl px-3 py-2 border ${sc.bg} flex items-center justify-between gap-2 h-full`}>
          <div className="min-w-0">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Strength</p>
            <p className={`text-sm font-black ${sc.color} leading-none mt-0.5`}>{strength}</p>
          </div>
          <div className="shrink-0">
            {strength === "Strong" && (
              <svg width="18" height="18" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-emerald-600">
                <path d="M4 11l5 5 9-9" />
              </svg>
            )}
            {strength === "Good" && (
              <svg width="18" height="18" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-amber-600">
                <path d="M11 2v9M11 15h.01" />
              </svg>
            )}
            {strength === "Weak" && (
              <svg width="18" height="18" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-red-600">
                <path d="M4 4l14 14M18 4L4 18" />
              </svg>
            )}
          </div>
        </div>

      </div>

      {/* Missing section indicators */}
      {missing.length > 0 && (
        <div className="pt-2 border-t border-slate-100/60 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">Missing:</span>
          <div className="flex flex-wrap gap-1">
            {missing.map((m) => (
              <span key={m} className="px-2 py-0.5 text-[10px] font-semibold bg-red-50 text-red-600 border border-red-100 rounded-md">
                {m}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}