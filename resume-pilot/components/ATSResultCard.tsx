"use client";

import { ATSResult } from "@/types/resume";

interface Props {
  result: ATSResult | null;
}

function scoreColor(score: number, max: number) {
  const pct = (score / max) * 100;
  if (pct >= 75) return { text: "text-emerald-700", bg: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700", label: "Good" };
  if (pct >= 40) return { text: "text-amber-700", bg: "bg-amber-500", badge: "bg-amber-100 text-amber-700", label: "Needs Work" };
  return { text: "text-red-700", bg: "bg-red-500", badge: "bg-red-100 text-red-700", label: "Poor" };
}

function totalColor(score: number) {
  if (score >= 75) return { ring: "stroke-emerald-500", text: "text-emerald-600", label: "Excellent" };
  if (score >= 55) return { ring: "stroke-blue-500", text: "text-blue-600", label: "Good" };
  if (score >= 35) return { ring: "stroke-amber-500", text: "text-amber-600", label: "Average" };
  return { ring: "stroke-red-500", text: "text-red-600", label: "Poor" };
}

export default function ATSResultCard({ result }: Props) {
  if (!result) return null;

  const tColor = totalColor(result.totalScore);
  const circumference = 2 * Math.PI * 44;
  const dashOffset = circumference * (1 - result.totalScore / 100);

  return (
    <div className="space-y-6">
      {/* Score circle */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6">
        {/* SVG circle */}
        <div className="relative w-32 h-32 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="#e2e8f0" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="44" fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className={`${tColor.ring} transition-all duration-1000`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${tColor.text}`}>{result.totalScore}</span>
            <span className="text-xs text-slate-400 -mt-0.5">/ 100</span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-800">ATS Compatibility Score</h3>
          <p className={`text-sm font-semibold ${tColor.text} mt-0.5`}>{tColor.label}</p>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            {result.totalScore >= 75
              ? "Your resume is well-optimized for ATS systems. Recruiters are likely to see your application."
              : result.totalScore >= 55
              ? "Your resume passes most ATS filters. Address the suggestions below to improve further."
              : result.totalScore >= 35
              ? "Your resume may be filtered out by ATS systems. Significant improvements are recommended."
              : "Your resume needs substantial improvements to pass ATS filters."}
          </p>
        </div>
      </div>

      {/* Section breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Section Breakdown</h3>
        <div className="space-y-3">
          {Object.values(result.sections).map((sec) => {
            const c = scoreColor(sec.score, sec.maxScore);
            const pct = Math.round((sec.score / sec.maxScore) * 100);
            return (
              <div key={sec.label}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-700">{sec.label}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${c.badge}`}>{c.label}</span>
                  </div>
                  <span className={`text-sm font-bold ${c.text}`}>{sec.score}/{sec.maxScore}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${c.bg} transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-[10.5px] text-slate-500 mt-0.5">{sec.feedback}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Suggestions */}
      {result.suggestions.length > 0 && (
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5">
          <h3 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-amber-600">
              <path d="M7.5 1L1 13h13L7.5 1zM7.5 6v3M7.5 11h.01"/>
            </svg>
            Improvement Suggestions
          </h3>
          <ul className="space-y-2">
            {result.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.suggestions.length === 0 && (
        <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-emerald-600">
              <path d="M3 9l4 4 8-8"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-800">Excellent Resume!</p>
            <p className="text-xs text-emerald-700 mt-0.5">Your resume is well-structured and ATS-optimized. No major issues found.</p>
          </div>
        </div>
      )}
    </div>
  );
}
