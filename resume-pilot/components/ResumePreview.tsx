"use client";

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
      id="resume-preview"
      className="bg-white w-full min-h-[1050px] text-slate-900 font-sans"
      style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", lineHeight: "1.5" }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-8 py-7 text-white">
        <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {data.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-4 mt-2 text-blue-100 text-xs">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.linkedin && <span>{data.linkedin}</span>}
        </div>
        {data.summary && (
          <p className="mt-3 text-blue-50 text-xs max-w-2xl leading-relaxed">{data.summary}</p>
        )}
      </div>

      <div className="flex gap-0">
        {/* Left column */}
        <div className="w-[35%] bg-slate-50 px-6 py-6 space-y-5">
          {data.skills && (
            <Section title="Skills" accent="blue">
              <div className="flex flex-wrap gap-1.5 mt-1">
                {data.skills.split(/[,\n]/).filter(Boolean).map((s, i) => (
                  <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px] font-medium">
                    {s.trim()}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {data.education.length > 0 && data.education[0].institution && (
            <Section title="Education" accent="blue">
              {data.education.map((e) => (
                <div key={e.id} className="mt-2">
                  <p className="font-semibold text-slate-800 text-[10.5px]">{e.degree} {e.field && `in ${e.field}`}</p>
                  <p className="text-slate-600 text-[10px]">{e.institution}</p>
                  <p className="text-slate-400 text-[9.5px]">{e.startYear} – {e.endYear}</p>
                  {e.gpa && <p className="text-slate-500 text-[9.5px]">GPA: {e.gpa}</p>}
                </div>
              ))}
            </Section>
          )}

          {data.certifications && (
            <Section title="Certifications" accent="blue">
              {data.certifications.split("\n").filter(Boolean).map((c, i) => (
                <p key={i} className="text-[10px] text-slate-700 mt-1">{c}</p>
              ))}
            </Section>
          )}
        </div>

        {/* Right column */}
        <div className="flex-1 px-6 py-6 space-y-5">
          {data.experience.length > 0 && data.experience[0].company && (
            <Section title="Experience" accent="indigo">
              {data.experience.map((ex) => (
                <div key={ex.id} className="mt-3 pb-3 border-b border-slate-100 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-slate-800 text-[11px]">{ex.role}</p>
                      <p className="text-blue-700 text-[10px] font-medium">{ex.company}</p>
                    </div>
                    <span className="text-slate-400 text-[9.5px] whitespace-nowrap">
                      {ex.startDate} – {ex.current ? "Present" : ex.endDate}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[10px] mt-1.5 leading-relaxed">{ex.description}</p>
                </div>
              ))}
            </Section>
          )}

          {data.projects.length > 0 && data.projects[0].name && (
            <Section title="Projects" accent="indigo">
              {data.projects.map((p) => (
                <div key={p.id} className="mt-3 pb-3 border-b border-slate-100 last:border-0">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-slate-800 text-[11px]">{p.name}</p>
                    {p.link && <a href={p.link} className="text-blue-600 text-[9.5px]">{p.link}</a>}
                  </div>
                  <p className="text-[9.5px] text-blue-700 font-medium mt-0.5">{p.technologies}</p>
                  <p className="text-slate-600 text-[10px] mt-1 leading-relaxed">{p.description}</p>
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
      id="resume-preview"
      className="bg-white w-full min-h-[1050px] text-slate-900 px-10 py-8"
      style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", lineHeight: "1.5" }}
    >
      {/* Header */}
      <div className="border-b-2 border-slate-800 pb-4 mb-5">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {data.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-3 mt-1 text-slate-600 text-[10.5px]">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>|&nbsp;&nbsp;{data.phone}</span>}
          {data.linkedin && <span>|&nbsp;&nbsp;{data.linkedin}</span>}
        </div>
        {data.summary && (
          <p className="mt-2 text-slate-700 text-[10.5px] leading-relaxed">{data.summary}</p>
        )}
      </div>

      <div className="space-y-4">
        {data.education.length > 0 && data.education[0].institution && (
          <ProSection title="EDUCATION">
            {data.education.map((e) => (
              <div key={e.id} className="flex justify-between mt-1.5">
                <div>
                  <p className="font-semibold text-slate-800">{e.degree} {e.field && `in ${e.field}`}</p>
                  <p className="text-slate-600 text-[10px]">{e.institution}{e.gpa ? ` — GPA: ${e.gpa}` : ""}</p>
                </div>
                <span className="text-slate-500 text-[10px] shrink-0">{e.startYear} – {e.endYear}</span>
              </div>
            ))}
          </ProSection>
        )}

        {data.skills && (
          <ProSection title="SKILLS">
            <p className="text-slate-700 text-[10.5px] mt-1">{data.skills}</p>
          </ProSection>
        )}

        {data.experience.length > 0 && data.experience[0].company && (
          <ProSection title="EXPERIENCE">
            {data.experience.map((ex) => (
              <div key={ex.id} className="mt-2">
                <div className="flex justify-between">
                  <p className="font-semibold text-slate-800">{ex.role}, <span className="font-normal text-slate-700">{ex.company}</span></p>
                  <span className="text-slate-500 text-[10px] shrink-0">{ex.startDate} – {ex.current ? "Present" : ex.endDate}</span>
                </div>
                <p className="text-slate-600 text-[10px] mt-0.5 leading-relaxed">{ex.description}</p>
              </div>
            ))}
          </ProSection>
        )}

        {data.projects.length > 0 && data.projects[0].name && (
          <ProSection title="PROJECTS">
            {data.projects.map((p) => (
              <div key={p.id} className="mt-2">
                <p className="font-semibold text-slate-800">{p.name} <span className="font-normal text-slate-600 text-[10px]">| {p.technologies}</span></p>
                <p className="text-slate-600 text-[10px] mt-0.5 leading-relaxed">{p.description}</p>
              </div>
            ))}
          </ProSection>
        )}

        {data.certifications && (
          <ProSection title="CERTIFICATIONS">
            <p className="text-slate-700 text-[10.5px] mt-1">{data.certifications}</p>
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
      id="resume-preview"
      className="bg-white w-full min-h-[1050px] text-slate-900 px-10 py-8"
      style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", lineHeight: "1.6" }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {data.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap justify-center gap-3 mt-1 text-slate-500 text-[10px]">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>•&nbsp;{data.phone}</span>}
          {data.linkedin && <span>•&nbsp;{data.linkedin}</span>}
        </div>
        {data.summary && <p className="mt-2 text-slate-600 text-[10.5px] max-w-xl mx-auto">{data.summary}</p>}
      </div>

      <div className="space-y-4">
        {data.education.length > 0 && data.education[0].institution && (
          <MinSection title="Education">
            {data.education.map((e) => (
              <div key={e.id} className="flex justify-between mt-1">
                <div>
                  <span className="font-medium text-slate-800">{e.degree} in {e.field}</span>
                  <span className="text-slate-500">, {e.institution}</span>
                  {e.gpa && <span className="text-slate-400"> | GPA: {e.gpa}</span>}
                </div>
                <span className="text-slate-400 shrink-0">{e.startYear}–{e.endYear}</span>
              </div>
            ))}
          </MinSection>
        )}

        {data.skills && (
          <MinSection title="Skills">
            <p className="text-slate-700 mt-1">{data.skills}</p>
          </MinSection>
        )}

        {data.experience.length > 0 && data.experience[0].company && (
          <MinSection title="Experience">
            {data.experience.map((ex) => (
              <div key={ex.id} className="mt-2">
                <div className="flex justify-between">
                  <p><span className="font-medium text-slate-800">{ex.role}</span> — {ex.company}</p>
                  <span className="text-slate-400 shrink-0 text-[10px]">{ex.startDate}–{ex.current ? "Present" : ex.endDate}</span>
                </div>
                <p className="text-slate-600 text-[10px] mt-0.5">{ex.description}</p>
              </div>
            ))}
          </MinSection>
        )}

        {data.projects.length > 0 && data.projects[0].name && (
          <MinSection title="Projects">
            {data.projects.map((p) => (
              <div key={p.id} className="mt-2">
                <p><span className="font-medium text-slate-800">{p.name}</span> <span className="text-slate-400 text-[10px]">({p.technologies})</span></p>
                <p className="text-slate-600 text-[10px] mt-0.5">{p.description}</p>
              </div>
            ))}
          </MinSection>
        )}

        {data.certifications && (
          <MinSection title="Certifications">
            <p className="text-slate-700 mt-1">{data.certifications}</p>
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
      <h2 className={`text-[10px] font-bold uppercase tracking-wider ${accent === "blue" ? "text-blue-700" : "text-indigo-700"} mb-1`}>
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
      <h2 className="text-[10px] font-bold tracking-widest text-slate-700 mb-1">{title}</h2>
      <div className="h-px w-full bg-slate-300 mb-2" />
      {children}
    </div>
  );
}

function MinSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[11px] font-semibold text-slate-900 border-b border-slate-200 pb-0.5 mb-1">{title}</h2>
      {children}
    </div>
  );
}
