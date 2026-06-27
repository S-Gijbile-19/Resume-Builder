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
      className="bg-white w-full h-auto text-slate-900 font-sans flex flex-col overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", lineHeight: "1.5" }}
    >
      {/* Header with explicit bounds to avoid title clipping */}
      <div className="px-10 py-7 text-white shrink-0 block w-full" style={{ backgroundColor: "#1d4ed8" }}>
        <h1 className="text-3xl font-bold tracking-tight pr-4 break-words" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {data.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-blue-100 text-xs w-full break-all">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.linkedin && <span className="break-all">{data.linkedin}</span>}
          {data.address && <span>{data.address}</span>}
        </div>
        {data.summary && (
          <p className="mt-3 text-blue-50 text-[10.5px] max-w-2xl leading-relaxed pr-2 whitespace-pre-line">{data.summary}</p>
        )}
      </div>

      <div className="flex flex-1 min-h-0 w-full">
        {/* Left column */}
        <div className="w-[35%] bg-slate-50 px-6 py-6 space-y-5 border-r border-slate-100 h-auto shrink-0">
          {data.skills && (
            <Section title="Skills" accent="blue">
              <div className="flex flex-wrap gap-1.5 mt-2">
                {data.skills.split(/[,\n]/).filter(Boolean).map((s, i) => (
                  <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px] font-medium max-w-full break-words">
                    {s.trim()}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {data.education && data.education.length > 0 && (
            <Section title="Education" accent="blue">
              {data.education.map((e) => (
                <div key={e.id} className="mt-2.5 last:mb-0 pr-1">
                  <p className="font-semibold text-slate-800 text-[10.5px] break-words">{e.degree} {e.field && `in ${e.field}`}</p>
                  <p className="text-slate-600 text-[10px] break-words">{e.institution}</p>
                  <p className="text-slate-400 text-[9.5px]">{e.startYear} – {e.endYear}</p>
                  {e.gpa && <p className="text-slate-500 text-[9.5px]">GPA: {e.gpa}</p>}
                </div>
              ))}
            </Section>
          )}

          {data.certifications && (
            <Section title="Certifications" accent="blue">
              {data.certifications.split("\n").filter(Boolean).map((c, i) => (
                <p key={i} className="text-[10px] text-slate-700 mt-1.5 break-words pr-1">{c}</p>
              ))}
            </Section>
          )}

          {data.languages && (
            <Section title="Languages" accent="blue">
              <p className="text-[10px] text-slate-700 mt-1.5 leading-relaxed break-words pr-1">{data.languages}</p>
            </Section>
          )}
        </div>

        {/* Right column */}
        <div className="flex-1 px-6 py-6 space-y-5 bg-white h-auto overflow-hidden">
          {data.experience && data.experience.length > 0 && (
            <Section title="Experience" accent="indigo">
              {data.experience.map((ex) => (
                <div key={ex.id} className="mt-2.5 pb-2.5 border-b border-slate-100 last:border-0 last:pb-0 pr-1">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800 text-[11px] break-words pr-1">{ex.role}</p>
                      <p className="text-blue-700 text-[10px] font-medium break-words">{ex.company}</p>
                    </div>
                    <span className="text-slate-400 text-[9.5px] whitespace-nowrap shrink-0 pt-0.5">
                      {ex.startDate} – {ex.current ? "Present" : ex.endDate}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[10px] mt-1.5 leading-relaxed whitespace-pre-line break-words">{ex.description}</p>
                </div>
              ))}
            </Section>
          )}

          {data.projects && data.projects.length > 0 && (
            <Section title="Projects" accent="indigo">
              {data.projects.map((p) => (
                <div key={p.id} className="mt-2.5 pb-2.5 border-b border-slate-100 last:border-0 last:pb-0 pr-1">
                  {/* 🚀 FIXED: Dynamic Block System For Long GitHub Links and Project Titles */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-1 w-full">
                    <p className="font-semibold text-slate-800 text-[11px] pr-2 break-words flex-1">{p.name}</p>
                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-[9.5px] break-all block max-w-full text-left sm:text-right shrink-0"
                      >
                        {p.link}
                      </a>
                    )}
                  </div>
                  <p className="text-[9.5px] text-blue-700 font-medium mt-0.5 break-words">{p.technologies}</p>
                  <p className="text-slate-600 text-[10px] mt-1.5 leading-relaxed whitespace-pre-line break-words">{p.description}</p>
                </div>
              ))}
            </Section>
          )}

          {data.achievements && (
            <Section title="Achievements" accent="indigo">
              <ul className="space-y-1.5 mt-2 pr-1">
                {data.achievements.split("\n").filter(Boolean).map((a, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-slate-600 text-[10px] break-words">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-indigo-500 shrink-0" />
                    <span className="flex-1 min-w-0 break-words">{a}</span>
                  </li>
                ))}
              </ul>
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
      className="bg-white w-full h-auto text-slate-900 px-10 py-8 font-sans flex flex-col overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", lineHeight: "1.5" }}
    >
      <div className="border-b-2 border-slate-800 pb-4 mb-5 text-left w-full">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight pr-2 break-words" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {data.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-slate-600 text-[10.5px] w-full break-all">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>|&nbsp;&nbsp;{data.phone}</span>}
          {data.linkedin && <span className="break-all">|&nbsp;&nbsp;{data.linkedin}</span>}
          {data.address && <span>|&nbsp;&nbsp;{data.address}</span>}
        </div>
        {data.summary && (
          <p className="mt-2.5 text-slate-700 text-[10.5px] leading-relaxed whitespace-pre-line pr-2 break-words">{data.summary}</p>
        )}
      </div>

      <div className="space-y-5 flex-1 w-full">
        {data.education && data.education.length > 0 && (
          <ProSection title="EDUCATION">
            {data.education.map((e) => (
              <div key={e.id} className="flex justify-between items-start gap-4 mt-1.5 pr-1">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800 break-words">{e.degree} {e.field && `in ${e.field}`}</p>
                  <p className="text-slate-600 text-[10px] break-words">{e.institution}{e.gpa ? ` — GPA: ${e.gpa}` : ""}</p>
                </div>
                <span className="text-slate-500 text-[10px] shrink-0 pt-0.5">{e.startYear} – {e.endYear}</span>
              </div>
            ))}
          </ProSection>
        )}

        {data.skills && (
          <ProSection title="SKILLS">
            <p className="text-slate-700 text-[10.5px] mt-1.5 pr-1 break-words leading-relaxed">{data.skills}</p>
          </ProSection>
        )}

        {data.experience && data.experience.length > 0 && (
          <ProSection title="EXPERIENCE">
            {data.experience.map((ex) => (
              <div key={ex.id} className="mt-2.5 pr-1">
                <div className="flex justify-between items-start gap-4">
                  <p className="font-semibold text-slate-800 flex-1 min-w-0 break-words">
                    {ex.role}, <span className="font-normal text-slate-700 break-words">{ex.company}</span>
                  </p>
                  <span className="text-slate-500 text-[10px] shrink-0 pt-0.5">{ex.startDate} – {ex.current ? "Present" : ex.endDate}</span>
                </div>
                <p className="text-slate-600 text-[10px] mt-1.5 leading-relaxed whitespace-pre-line break-words">{ex.description}</p>
              </div>
            ))}
          </ProSection>
        )}

        {data.projects && data.projects.length > 0 && (
          <ProSection title="PROJECTS">
            {data.projects.map((p) => (
              <div key={p.id} className="mt-2.5 pr-1">
                {/* 🚀 FIXED: Added layout bounds matrix inside professional projects template */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-1 w-full">
                  <p className="font-semibold text-slate-800 text-[11px] pr-2 break-words flex-1">
                    {p.name} <span className="font-normal text-slate-600 text-[10px] break-words">| {p.technologies}</span>
                  </p>
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-[9.5px] break-all block max-w-full text-left sm:text-right shrink-0"
                    >
                      {p.link}
                    </a>
                  )}
                </div>
                <p className="text-slate-600 text-[10px] mt-1 leading-relaxed whitespace-pre-line break-words">{p.description}</p>
              </div>
            ))}
          </ProSection>
        )}

        {data.achievements && (
          <ProSection title="ACHIEVEMENTS">
            <ul className="space-y-1 mt-1.5 pr-1">
              {data.achievements.split("\n").filter(Boolean).map((a, i) => (
                <li key={i} className="text-slate-700 text-[10.5px] list-disc list-inside break-words">
                  {a}
                </li>
              ))}
            </ul>
          </ProSection>
        )}

        {data.certifications && (
          <ProSection title="CERTIFICATIONS">
            {data.certifications.split("\n").filter(Boolean).map((c, i) => (
              <p key={i} className="text-[10.5px] text-slate-700 mt-1 break-words pr-1">{c}</p>
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
      id="resume-preview"
      className="bg-white w-full h-auto text-slate-900 px-10 py-8 font-sans flex flex-col overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", lineHeight: "1.6" }}
    >
      <div className="text-center mb-6 w-full">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight pr-1 break-words" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {data.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-1 text-slate-500 text-[10px] w-full break-all px-4">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>•&nbsp;{data.phone}</span>}
          {data.linkedin && <span className="break-all">•&nbsp;{data.linkedin}</span>}
          {data.address && <span>•&nbsp;{data.address}</span>}
        </div>
        {data.summary && (
          <p className="mt-2.5 text-slate-600 text-[10.5px] max-w-xl mx-auto whitespace-pre-line leading-relaxed pr-1 break-words">
            {data.summary}
          </p>
        )}
      </div>

      <div className="space-y-5 flex-1 w-full">
        {data.education && data.education.length > 0 && (
          <MinSection title="Education">
            {data.education.map((e) => (
              <div key={e.id} className="flex justify-between items-start gap-4 mt-1.5 pr-1">
                <div className="min-w-0 flex-1">
                  <span className="font-semibold text-slate-800 break-words">{e.degree} {e.field && `in ${e.field}`}</span>
                  <span className="text-slate-500 break-words">, {e.institution}</span>
                </div>
                <span className="text-slate-400 shrink-0 text-[10px] pt-0.5">{e.startYear}–{e.endYear}</span>
              </div>
            ))}
          </MinSection>
        )}

        {data.skills && (
          <MinSection title="Skills">
            <p className="text-slate-700 mt-1.5 pr-1 break-words leading-relaxed">{data.skills}</p>
          </MinSection>
        )}

        {data.experience && data.experience.length > 0 && (
          <MinSection title="Experience">
            {data.experience.map((ex) => (
              <div key={ex.id} className="mt-2.5 pr-1">
                <div className="flex justify-between items-start gap-4">
                  <p className="font-semibold text-slate-800 flex-1 min-w-0 break-words">
                    {ex.role} <span className="font-normal text-slate-500 break-words">— {ex.company}</span>
                  </p>
                  <span className="text-slate-400 shrink-0 text-[10px] pt-0.5">{ex.startDate}–{ex.current ? "Present" : ex.endDate}</span>
                </div>
                <p className="text-slate-600 text-[10px] mt-0.5 leading-relaxed whitespace-pre-line break-words">{ex.description}</p>
              </div>
            ))}
          </MinSection>
        )}

        {data.projects && data.projects.length > 0 && (
          <MinSection title="Projects">
            {data.projects.map((p) => (
              <div key={p.id} className="mt-2.5 pr-1">
                {/* 🚀 FIXED: Link breaking logic for minimal layout rules */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-1 w-full">
                  <p className="font-semibold text-slate-800 text-[11px] pr-2 break-words flex-1">
                    {p.name} <span className="font-normal text-slate-500 text-[10px] break-words">({p.technologies})</span>
                  </p>
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-[9.5px] break-all block max-w-full text-left sm:text-right shrink-0"
                    >
                      {p.link}
                    </a>
                  )}
                </div>
                <p className="text-slate-600 text-[10px] mt-0.5 whitespace-pre-line break-words">{p.description}</p>
              </div>
            ))}
          </MinSection>
        )}

        {data.achievements && (
          <MinSection title="Achievements">
            <ul className="space-y-1 mt-1.5 pr-1">
              {data.achievements.split("\n").filter(Boolean).map((a, i) => (
                <li key={i} className="text-slate-700 text-[10.5px] list-disc list-inside break-words">
                  {a}
                </li>
              ))}
            </ul>
          </MinSection>
        )}

        {data.certifications && (
          <MinSection title="Certifications">
            {data.certifications.split("\n").filter(Boolean).map((c, i) => (
              <p key={i} className="text-[10.5px] text-slate-700 mt-1 break-words pr-1">{c}</p>
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
    <div className="w-full block">
      <h2 className={`text-[10px] font-bold uppercase tracking-wider ${accent === "blue" ? "text-blue-700" : "text-indigo-700"} mb-0.5 pr-2 break-words`}>
        {title}
      </h2>
      <div className={`h-px w-full ${accent === "blue" ? "bg-blue-200" : "bg-indigo-200"} mb-1.5`} />
      {children}
    </div>
  );
}

function ProSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="w-full block">
      <h2 className="text-[10px] font-bold tracking-widest text-slate-700 mb-0.5 pr-2 break-words">{title}</h2>
      <div className="h-px w-full bg-slate-300 mb-1.5" />
      {children}
    </div>
  );
}

function MinSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="w-full block">
      <h2 className="text-[11px] font-semibold text-slate-900 border-b border-slate-200 pb-0.5 mb-1 pr-2 break-words">{title}</h2>
      {children}
    </div>
  );
}