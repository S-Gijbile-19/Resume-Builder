"use client";

import React from "react";
import { ResumeData, TemplateType } from "@/types/resume";

interface Props {
  data: ResumeData;
  template: TemplateType;
  previewRef?: React.RefObject<HTMLDivElement | null>;
}

export default function ResumePreview({ data, template, previewRef }: Props) {
  if (template === "modern") return <ModernTemplate data={data} previewRef={previewRef} />;
  if (template === "professional") return <ProfessionalTemplate data={data} previewRef={previewRef} />;
  return <MinimalTemplate data={data} previewRef={previewRef} />;
}

/* ─── MODERN TEMPLATE ────────────────────────────────────────────── */
function ModernTemplate({ data, previewRef }: { data: ResumeData; previewRef?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={previewRef}
      id="resume-preview-root"
      className="bg-white w-full min-h-[1120px] text-slate-900 font-sans p-0 m-0"
      style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", lineHeight: "1.6" }}
    >
      {/* Header */}
      <div className="px-10 py-9 text-white bg-blue-700" style={{ backgroundColor: "#1d4ed8" }}>
        <h1 className="text-4xl font-extrabold tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {data.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-blue-100 text-sm">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.linkedin && <span>{data.linkedin}</span>}
          {data.address && <span>{data.address}</span>}
        </div>
        {data.summary && (
          <p className="mt-4 text-blue-50 text-sm max-w-3xl leading-relaxed">{data.summary}</p>
        )}
      </div>

      <div className="flex gap-0 min-h-[920px]">
        {/* Left column */}
        <div className="w-[35%] bg-slate-50 px-8 py-8 space-y-6 border-r border-slate-100 shrink-0">
          {data.skills && (
            <Section title="Skills" accent="blue">
              <div className="flex flex-wrap gap-2 mt-2">
                {data.skills.split(/[,\n]/).filter(Boolean).map((s, i) => (
                  <span key={i} className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                    {s.trim()}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {data.education.length > 0 && data.education[0].institution && (
            <Section title="Education" accent="blue">
              {data.education.map((e) => (
                <div key={e.id} className="mt-3">
                  <p className="font-bold text-slate-800 text-[13px]">{e.degree} {e.field && `in ${e.field}`}</p>
                  <p className="text-slate-600 text-xs mt-0.5">{e.institution}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{e.startYear} – {e.endYear}</p>
                  {e.gpa && <p className="text-slate-500 text-xs mt-0.5">GPA: {e.gpa}</p>}
                </div>
              ))}
            </Section>
          )}

          {data.certifications && (
            <Section title="Certifications" accent="blue">
              {data.certifications.split("\n").filter(Boolean).map((c, i) => (
                <p key={i} className="text-xs text-slate-700 mt-2 leading-relaxed">{c}</p>
              ))}
            </Section>
          )}

          {data.languages && (
            <Section title="Languages" accent="blue">
              <p className="text-xs text-slate-700 mt-2 leading-relaxed">{data.languages}</p>
            </Section>
          )}
        </div>

        {/* Right column */}
        <div className="flex-1 px-8 py-8 space-y-6 bg-white">
          {data.experience.length > 0 && data.experience[0].company && (
            <Section title="Experience" accent="indigo">
              {data.experience.map((ex) => (
                <div key={ex.id} className="mt-4 pb-4 border-b border-slate-100 last:border-0">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="font-bold text-slate-800 text-[14px]">{ex.role}</p>
                      <p className="text-blue-700 text-xs font-semibold mt-0.5">{ex.company}</p>
                    </div>
                    <span className="text-slate-400 text-xs whitespace-nowrap pt-0.5">
                      {ex.startDate} – {ex.current ? "Present" : ex.endDate}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs mt-2.5 leading-relaxed whitespace-pre-line">{ex.description}</p>
                </div>
              ))}
            </Section>
          )}

          {data.projects.length > 0 && data.projects[0].name && (
            <Section title="Projects" accent="indigo">
              {data.projects.map((p) => (
                <div key={p.id} className="mt-4 pb-4 border-b border-slate-100 last:border-0">
                  <div className="flex justify-between items-start gap-4">
                    <p className="font-bold text-slate-800 text-[14px]">{p.name}</p>
                    {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs truncate max-w-[180px]">{p.link}</a>}
                  </div>
                  <p className="text-xs text-blue-700 font-semibold mt-1">{p.technologies}</p>
                  <p className="text-slate-600 text-xs mt-2 leading-relaxed whitespace-pre-line">{p.description}</p>
                </div>
              ))}
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── PROFESSIONAL TEMPLATE ─────────────────────────────────────── */
function ProfessionalTemplate({ data, previewRef }: { data: ResumeData; previewRef?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={previewRef}
      id="resume-preview-root"
      className="bg-white text-slate-900 px-12 py-10 font-sans"
      style={{
        width: "794px",
        minHeight: "1123px",
        fontFamily: "'Inter', sans-serif",
        fontSize: "13px",
        lineHeight: "1.6",
      }}
    >
      {/* Header */}
      <div className="border-b-2 border-slate-800 pb-5 mb-6 text-left">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {data.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-slate-600 text-xs font-medium">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>|&nbsp;&nbsp;{data.phone}</span>}
          {data.linkedin && <span>|&nbsp;&nbsp;{data.linkedin}</span>}
          {data.address && <span>|&nbsp;&nbsp;{data.address}</span>}
        </div>
        {data.summary && (
          <p className="mt-3.5 text-slate-700 text-xs leading-relaxed whitespace-pre-line">{data.summary}</p>
        )}
      </div>

      <div className="space-y-6">
        {data.education.length > 0 && data.education[0].institution && (
          <ProSection title="EDUCATION">
            {data.education.map((e) => (
              <div key={e.id} className="flex justify-between items-start mt-2 gap-4">
                <div>
                  <p className="font-bold text-slate-800">{e.degree} {e.field && `in ${e.field}`}</p>
                  <p className="text-slate-600 text-xs mt-0.5">{e.institution}{e.gpa ? ` — GPA: ${e.gpa}` : ""}</p>
                </div>
                <span className="text-slate-500 text-xs shrink-0">{e.startYear} – {e.endYear}</span>
              </div>
            ))}
          </ProSection>
        )}

        {data.skills && (
          <ProSection title="SKILLS">
            <p className="text-slate-700 text-xs mt-2 leading-relaxed">{data.skills}</p>
          </ProSection>
        )}

        {data.experience.length > 0 && data.experience[0].company && (
          <ProSection title="EXPERIENCE">
            {data.experience.map((ex) => (
              <div key={ex.id} className="mt-3">
                <div className="flex justify-between items-start gap-4">
                  <p className="font-bold text-slate-800">{ex.role}, <span className="font-normal text-slate-700">{ex.company}</span></p>
                  <span className="text-slate-500 text-xs shrink-0">{ex.startDate} – {ex.current ? "Present" : ex.endDate}</span>
                </div>
                <p className="text-slate-600 text-xs mt-2 leading-relaxed whitespace-pre-line">{ex.description}</p>
              </div>
            ))}
          </ProSection>
        )}
      </div>
    </div>
  );
}

/* ─── MINIMAL TEMPLATE ───────────────────────────────────────────── */
function MinimalTemplate({ data, previewRef }: { data: ResumeData; previewRef?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={previewRef}
      id="resume-preview-root"
      className="bg-white w-full min-h-[1120px] text-slate-900 px-12 py-10 font-sans"
      style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", lineHeight: "1.6" }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {data.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2 text-slate-500 text-xs">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>•&nbsp;{data.phone}</span>}
          {data.linkedin && <span>•&nbsp;{data.linkedin}</span>}
          {data.address && <span>•&nbsp;{data.address}</span>}
        </div>
        {data.summary && <p className="mt-3.5 text-slate-600 text-xs max-w-2xl mx-auto whitespace-pre-line leading-relaxed">{data.summary}</p>}
      </div>

      <div className="space-y-6">
        {data.skills && (
          <MinSection title="Skills">
            <p className="text-slate-700 mt-1.5 text-xs leading-relaxed">{data.skills}</p>
          </MinSection>
        )}

        {data.experience.length > 0 && data.experience[0].company && (
          <MinSection title="Experience">
            {data.experience.map((ex) => (
              <div key={ex.id} className="mt-3">
                <div className="flex justify-between items-start gap-4">
                  <p className="font-bold text-slate-800">{ex.role} <span className="font-normal text-slate-500">— {ex.company}</span></p>
                  <span className="text-slate-400 shrink-0 text-xs">{ex.startDate}–{ex.current ? "Present" : ex.endDate}</span>
                </div>
                <p className="text-slate-600 text-xs mt-1.5 leading-relaxed whitespace-pre-line">{ex.description}</p>
              </div>
            ))}
          </MinSection>
        )}
      </div>
    </div>
  );
}

/* ─── Shared section wrappers ────────────────────────────────────── */
function Section({ title, children, accent }: { title: string; children: React.ReactNode; accent: string }) {
  return (
    <div>
      <h2 className={`text-xs font-bold uppercase tracking-wider ${accent === "blue" ? "text-blue-700" : "text-indigo-700"} mb-1`}>
        {title}
      </h2>
      <div className={`h-px w-full ${accent === "blue" ? "bg-blue-200" : "bg-indigo-200"} mb-2`} />
      {children}
    </div>
  );
}

function ProSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xs font-bold tracking-widest text-slate-700 mb-1">{title}</h2>
      <div className="h-px w-full bg-slate-300 mb-2" />
      {children}
    </div>
  );
}

function MinSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2">{title}</h2>
      {children}
    </div>
  );
}