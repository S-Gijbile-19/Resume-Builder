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
    Weak: { color: "text-red-600", bg: "bg-red-100", bar: "bg-red-500", desc: "Add more sections and detail to strengthen your resume." },
    Good: { color: "text-amber-600", bg: "bg-amber-100", bar: "bg-amber-500", desc: "Your resume is decent. A few more improvements will make it stand out." },
    Strong: { color: "text-emerald-600", bg: "bg-emerald-100", bar: "bg-emerald-500", desc: "Great work! Your resume is well-structured and complete." },
  };
  const sc = strengthConfig[strength];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
      <h2 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-3">Resume Health Report</h2>

      {/* Completion */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm font-medium text-slate-700">Completion</span>
          <span className="text-sm font-bold text-blue-600">{completion}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      {/* ATS Score */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm font-medium text-slate-700">ATS Score</span>
          <span className="text-sm font-bold text-slate-700">{atsScore > 0 ? `${atsScore}/100` : "Run checker"}</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
            style={{ width: `${atsScore}%` }}
          />
        </div>
      </div>

      {/* Strength */}
      <div className={`${sc.bg} rounded-xl px-4 py-3 flex items-center justify-between`}>
        <div>
          <p className="text-xs text-slate-600 font-medium">Resume Strength</p>
          <p className={`text-lg font-bold ${sc.color}`}>{strength}</p>
          <p className="text-[10.5px] text-slate-500 mt-0.5 max-w-[180px]">{sc.desc}</p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${sc.bg} border-2 ${strength === "Strong" ? "border-emerald-300" : strength === "Good" ? "border-amber-300" : "border-red-300"}`}>
          {strength === "Strong" && (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-emerald-600">
              <path d="M4 11l5 5 9-9"/>
            </svg>
          )}
          {strength === "Good" && (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-amber-600">
              <path d="M11 2v9M11 15h.01"/>
            </svg>
          )}
          {strength === "Weak" && (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-red-600">
              <path d="M4 4l14 14M18 4L4 18"/>
            </svg>
          )}
        </div>
      </div>

      {/* Missing sections */}
      {missing.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-600 mb-2">Missing Sections</p>
          <div className="flex flex-wrap gap-1.5">
            {missing.map((m) => (
              <span key={m} className="px-2 py-0.5 text-[11px] font-medium bg-red-50 text-red-600 border border-red-200 rounded-full">
                {m}
              </span>
            ))}
          </div>
        </div>
      )}

      {missing.length === 0 && (
        <div className="flex items-center gap-2 text-xs text-emerald-700">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M2.5 7l3 3 6-6"/>
          </svg>
          All sections are complete.
        </div>
      )}
    </div>
  );
}
