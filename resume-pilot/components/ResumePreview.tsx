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
      <div
        className="px-8 py-7 text-white"
        style={{
          backgroundColor: "#1d4ed8",
        }}
      >
        <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {data.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-blue-100 text-xs">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.linkedin && <span>{data.linkedin}</span>}
          {data.address && <span>{data.address}</span>}
        </div>
        {data.summary && (
          <p className="mt-3 text-blue-50 text-xs max-w-2xl leading-relaxed">{data.summary}</p>
        )}
      </div>

      <div className="flex gap-0 min-h-[850px]">
        {/* Left column */}
        <div className="w-[35%] bg-slate-50 px-6 py-6 space-y-5 border-r border-slate-100">
          {data.skills && (
            <Section title="Skills" accent="blue">
              <div className="flex flex-wrap gap-1.5 mt-1">
                {data.skills.split(/[,\n]/).filter(Boolean).map((s, i) => (
                  <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px] font-medium transition-all hover:scale-105">
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

          {data.languages && (
            <Section title="Languages" accent="blue">
              <p className="text-[10px] text-slate-700 mt-1 leading-relaxed">{data.languages}</p>
            </Section>
          )}
        </div>

        {/* Right column */}
        <div className="flex-1 px-6 py-6 space-y-5 bg-white">
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
                  <p className="text-slate-600 text-[10px] mt-1.5 leading-relaxed whitespace-pre-line">{ex.description}</p>
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
                    {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-[9.5px] truncate max-w-[150px]">{p.link}</a>}
                  </div>
                  <p className="text-[9.5px] text-blue-700 font-medium mt-0.5">{p.technologies}</p>
                  <p className="text-slate-600 text-[10px] mt-1 leading-relaxed whitespace-pre-line">{p.description}</p>
                </div>
              ))}
            </Section>
          )}

          {data.achievements && (
            <Section title="Achievements" accent="indigo">
              <ul className="space-y-1 mt-1">
                {data.achievements.split("\n").filter(Boolean).map((a, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-slate-600 text-[10px]">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-indigo-500 shrink-0" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {data.documentType === "cv" && data.publications && (
            <Section title="Publications & Research" accent="indigo">
              <ul className="space-y-1.5 mt-1">
                {data.publications.split("\n").filter(Boolean).map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-slate-600 text-[10px]">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-indigo-500 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {data.documentType === "cv" && data.additionalDetails && (
            <Section title="Additional Details" accent="indigo">
              <div className="space-y-1 mt-1">
                {data.additionalDetails.split("\n").filter(Boolean).map((ad, i) => (
                  <p key={i} className="text-slate-600 text-[10px] leading-relaxed">{ad}</p>
                ))}
              </div>
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
      className="bg-white w-full min-h-[1050px] text-slate-900 px-10 py-8 font-sans"
      style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", lineHeight: "1.5" }}
    >
      {/* Header */}
      <div className="border-b-2 border-slate-800 pb-4 mb-5 text-center sm:text-left">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {data.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap justify-center sm:justify-start gap-x-3 gap-y-1 mt-1 text-slate-600 text-[10.5px]">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>|&nbsp;&nbsp;{data.phone}</span>}
          {data.linkedin && <span>|&nbsp;&nbsp;{data.linkedin}</span>}
          {data.address && <span>|&nbsp;&nbsp;{data.address}</span>}
        </div>
        {data.summary && (
          <p className="mt-2.5 text-slate-700 text-[10.5px] leading-relaxed whitespace-pre-line">{data.summary}</p>
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
                <p className="text-slate-600 text-[10px] mt-1 leading-relaxed whitespace-pre-line">{ex.description}</p>
              </div>
            ))}
          </ProSection>
        )}

        {data.projects.length > 0 && data.projects[0].name && (
          <ProSection title="PROJECTS">
            {data.projects.map((p) => (
              <div key={p.id} className="mt-2">
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-slate-800">{p.name} <span className="font-normal text-slate-600 text-[10px]">| {p.technologies}</span></p>
                  {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-[9.5px] truncate max-w-[150px]">{p.link}</a>}
                </div>
                <p className="text-slate-600 text-[10px] mt-0.5 leading-relaxed whitespace-pre-line">{p.description}</p>
              </div>
            ))}
          </ProSection>
        )}

        {data.certifications && (
          <ProSection title="CERTIFICATIONS">
            <ul className="list-disc pl-4 mt-1 text-slate-700 text-[10px] space-y-0.5">
              {data.certifications.split("\n").filter(Boolean).map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </ProSection>
        )}

        {data.achievements && (
          <ProSection title="ACHIEVEMENTS">
            <ul className="list-disc pl-4 mt-1 text-slate-700 text-[10px] space-y-0.5">
              {data.achievements.split("\n").filter(Boolean).map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </ProSection>
        )}

        {data.languages && (
          <ProSection title="LANGUAGES">
            <p className="text-slate-700 text-[10.5px] mt-1">{data.languages}</p>
          </ProSection>
        )}

        {data.documentType === "cv" && data.publications && (
          <ProSection title="PUBLICATIONS & RESEARCH">
            <ul className="list-disc pl-4 mt-1 text-slate-700 text-[10px] space-y-0.5">
              {data.publications.split("\n").filter(Boolean).map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </ProSection>
        )}

        {data.documentType === "cv" && data.additionalDetails && (
          <ProSection title="ADDITIONAL DETAILS">
            <div className="space-y-1 mt-1 text-slate-700 text-[10.5px] leading-relaxed">
              {data.additionalDetails.split("\n").filter(Boolean).map((ad, i) => (
                <p key={i}>{ad}</p>
              ))}
            </div>
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
      className="bg-white w-full min-h-[1050px] text-slate-900 px-10 py-8 font-sans"
      style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", lineHeight: "1.6" }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {data.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-1.5 text-slate-500 text-[10px]">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>•&nbsp;{data.phone}</span>}
          {data.linkedin && <span>•&nbsp;{data.linkedin}</span>}
          {data.address && <span>•&nbsp;{data.address}</span>}
        </div>
        {data.summary && <p className="mt-2.5 text-slate-600 text-[10.5px] max-w-xl mx-auto whitespace-pre-line leading-relaxed">{data.summary}</p>}
      </div>

      <div className="space-y-4">
        {data.education.length > 0 && data.education[0].institution && (
          <MinSection title="Education">
            {data.education.map((e) => (
              <div key={e.id} className="flex justify-between mt-1">
                <div>
                  <span className="font-semibold text-slate-800">{e.degree} {e.field && `in ${e.field}`}</span>
                  <span className="text-slate-500">, {e.institution}</span>
                  {e.gpa && <span className="text-slate-400"> | GPA: {e.gpa}</span>}
                </div>
                <span className="text-slate-400 shrink-0 text-[10px]">{e.startYear}–{e.endYear}</span>
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
                  <p className="font-semibold text-slate-800">{ex.role} <span className="font-normal text-slate-500">— {ex.company}</span></p>
                  <span className="text-slate-400 shrink-0 text-[10px]">{ex.startDate}–{ex.current ? "Present" : ex.endDate}</span>
                </div>
                <p className="text-slate-600 text-[10px] mt-0.5 leading-relaxed whitespace-pre-line">{ex.description}</p>
              </div>
            ))}
          </MinSection>
        )}

        {data.projects.length > 0 && data.projects[0].name && (
          <MinSection title="Projects">
            {data.projects.map((p) => (
              <div key={p.id} className="mt-2">
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-slate-800">{p.name} <span className="text-slate-400 font-normal text-[10px]">({p.technologies})</span></p>
                  {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-[9.5px] truncate max-w-[150px]">{p.link}</a>}
                </div>
                <p className="text-slate-600 text-[10px] mt-0.5 leading-relaxed whitespace-pre-line">{p.description}</p>
              </div>
            ))}
          </MinSection>
        )}

        {data.certifications && (
          <MinSection title="Certifications">
            <ul className="list-disc pl-4 text-slate-700 mt-1 space-y-0.5">
              {data.certifications.split("\n").filter(Boolean).map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </MinSection>
        )}

        {data.achievements && (
          <MinSection title="Achievements">
            <ul className="list-disc pl-4 text-slate-700 mt-1 space-y-0.5">
              {data.achievements.split("\n").filter(Boolean).map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </MinSection>
        )}

        {data.languages && (
          <MinSection title="Languages">
            <p className="text-slate-700 mt-1">{data.languages}</p>
          </MinSection>
        )}

        {data.documentType === "cv" && data.publications && (
          <MinSection title="Publications">
            <ul className="list-disc pl-4 text-slate-700 mt-1 space-y-0.5">
              {data.publications.split("\n").filter(Boolean).map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </MinSection>
        )}

        {data.documentType === "cv" && data.additionalDetails && (
          <MinSection title="Additional Details">
            <div className="space-y-1 mt-1 text-slate-600 leading-relaxed">
              {data.additionalDetails.split("\n").filter(Boolean).map((ad, i) => (
                <p key={i}>{ad}</p>
              ))}
            </div>
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
