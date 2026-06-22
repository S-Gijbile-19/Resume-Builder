"use client";

import { ResumeData, TemplateType } from "@/types/resume";
import { EducationEntry, ExperienceEntry, ProjectEntry } from "@/types/resume";

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  template: TemplateType;
  onTemplateChange: (t: TemplateType) => void;
  onDownload: () => void;
}

const templates: { id: TemplateType; label: string; desc: string }[] = [
  { id: "modern", label: "Modern", desc: "Two-column with color header" },
  { id: "professional", label: "Professional", desc: "Classic single-column" },
  { id: "minimal", label: "Minimal", desc: "Clean centered layout" },
];

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function BuilderForm({ data, onChange, template, onTemplateChange, onDownload }: Props) {
  const set = (field: keyof ResumeData, value: unknown) => onChange({ ...data, [field]: value });

  /* Education */
  const addEdu = () =>
    set("education", [...data.education, { id: genId(), institution: "", degree: "", field: "", startYear: "", endYear: "", gpa: "" }]);
  const updateEdu = (id: string, field: keyof EducationEntry, value: string) =>
    set("education", data.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  const removeEdu = (id: string) => set("education", data.education.filter((e) => e.id !== id));

  /* Experience */
  const addExp = () =>
    set("experience", [...data.experience, { id: genId(), company: "", role: "", startDate: "", endDate: "", description: "", current: false }]);
  const updateExp = (id: string, field: keyof ExperienceEntry, value: string | boolean) =>
    set("experience", data.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  const removeExp = (id: string) => set("experience", data.experience.filter((e) => e.id !== id));

  /* Projects */
  const addProject = () =>
    set("projects", [...data.projects, { id: genId(), name: "", description: "", technologies: "", link: "" }]);
  const updateProject = (id: string, field: keyof ProjectEntry, value: string) =>
    set("projects", data.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  const removeProject = (id: string) => set("projects", data.projects.filter((p) => p.id !== id));

  return (
    <div className="space-y-6">
      {/* Template switcher */}
      <Card title="Template">
        <div className="grid grid-cols-3 gap-3 mt-3">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => onTemplateChange(t.id)}
              className={`relative p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                template === t.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              {template === t.id && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4l1.8 1.8L6.5 2.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              )}
              <p className={`text-xs font-semibold ${template === t.id ? "text-blue-700" : "text-slate-700"}`}>{t.label}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Personal Info */}
      <Card title="Personal Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <Field label="Full Name" value={data.fullName} onChange={(v) => set("fullName", v)} placeholder="Jane Smith" />
          <Field label="Email" value={data.email} onChange={(v) => set("email", v)} placeholder="jane@example.com" type="email" />
          <Field label="Phone" value={data.phone} onChange={(v) => set("phone", v)} placeholder="+91 98765 43210" />
          <Field label="LinkedIn" value={data.linkedin} onChange={(v) => set("linkedin", v)} placeholder="linkedin.com/in/janesmith" />
        </div>
        <div className="mt-3">
          <label className="block text-xs font-medium text-slate-600 mb-1">Professional Summary <span className="text-slate-400 font-normal">(optional)</span></label>
          <textarea
            value={data.summary}
            onChange={(e) => set("summary", e.target.value)}
            rows={3}
            placeholder="Brief 2–3 sentence overview of your background and goals..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder:text-slate-300 resize-none"
          />
        </div>
      </Card>

      {/* Education */}
      <Card title="Education">
        {data.education.map((e, idx) => (
          <div key={e.id} className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 relative">
            <RemoveBtn onClick={() => removeEdu(e.id)} label="education entry" />
            <p className="text-xs font-semibold text-slate-500 mb-2">Entry {idx + 1}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Institution" value={e.institution} onChange={(v) => updateEdu(e.id, "institution", v)} placeholder="MIT" />
              <Field label="Degree" value={e.degree} onChange={(v) => updateEdu(e.id, "degree", v)} placeholder="Bachelor of Science" />
              <Field label="Field of Study" value={e.field} onChange={(v) => updateEdu(e.id, "field", v)} placeholder="Computer Science" />
              <Field label="GPA (optional)" value={e.gpa || ""} onChange={(v) => updateEdu(e.id, "gpa", v)} placeholder="3.8 / 4.0" />
              <Field label="Start Year" value={e.startYear} onChange={(v) => updateEdu(e.id, "startYear", v)} placeholder="2020" />
              <Field label="End Year" value={e.endYear} onChange={(v) => updateEdu(e.id, "endYear", v)} placeholder="2024" />
            </div>
          </div>
        ))}
        <AddBtn onClick={addEdu} label="Add Education" />
      </Card>

      {/* Skills */}
      <Card title="Skills">
        <div className="mt-3">
          <label className="block text-xs font-medium text-slate-600 mb-1">List your skills (comma-separated or one per line)</label>
          <textarea
            value={data.skills}
            onChange={(e) => set("skills", e.target.value)}
            rows={4}
            placeholder="JavaScript, React, Node.js, Python, SQL, Git, Figma, Problem Solving..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder:text-slate-300 resize-none"
          />
        </div>
      </Card>

      {/* Experience */}
      <Card title="Work Experience">
        {data.experience.map((ex, idx) => (
          <div key={ex.id} className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 relative">
            <RemoveBtn onClick={() => removeExp(ex.id)} label="experience entry" />
            <p className="text-xs font-semibold text-slate-500 mb-2">Position {idx + 1}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Company" value={ex.company} onChange={(v) => updateExp(ex.id, "company", v)} placeholder="Google" />
              <Field label="Role / Title" value={ex.role} onChange={(v) => updateExp(ex.id, "role", v)} placeholder="Software Engineer Intern" />
              <Field label="Start Date" value={ex.startDate} onChange={(v) => updateExp(ex.id, "startDate", v)} placeholder="Jun 2023" />
              {!ex.current && (
                <Field label="End Date" value={ex.endDate} onChange={(v) => updateExp(ex.id, "endDate", v)} placeholder="Aug 2023" />
              )}
            </div>
            <label className="flex items-center gap-2 mt-3 text-sm text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={ex.current}
                onChange={(e) => updateExp(ex.id, "current", e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Currently working here
            </label>
            <div className="mt-3">
              <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
              <textarea
                value={ex.description}
                onChange={(e) => updateExp(ex.id, "description", e.target.value)}
                rows={3}
                placeholder="Describe your responsibilities and key achievements. Use action verbs: Built, Led, Improved, Designed..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder:text-slate-300 resize-none"
              />
            </div>
          </div>
        ))}
        <AddBtn onClick={addExp} label="Add Experience" />
      </Card>

      {/* Projects */}
      <Card title="Projects">
        {data.projects.map((p, idx) => (
          <div key={p.id} className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 relative">
            <RemoveBtn onClick={() => removeProject(p.id)} label="project entry" />
            <p className="text-xs font-semibold text-slate-500 mb-2">Project {idx + 1}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Project Name" value={p.name} onChange={(v) => updateProject(p.id, "name", v)} placeholder="E-Commerce Platform" />
              <Field label="Technologies Used" value={p.technologies} onChange={(v) => updateProject(p.id, "technologies", v)} placeholder="React, Node.js, MongoDB" />
              <Field label="Project Link (optional)" value={p.link || ""} onChange={(v) => updateProject(p.id, "link", v)} placeholder="github.com/username/project" />
            </div>
            <div className="mt-3">
              <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
              <textarea
                value={p.description}
                onChange={(e) => updateProject(p.id, "description", e.target.value)}
                rows={3}
                placeholder="Describe what you built, the problem it solved, and your impact..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder:text-slate-300 resize-none"
              />
            </div>
          </div>
        ))}
        <AddBtn onClick={addProject} label="Add Project" />
      </Card>

      {/* Certifications */}
      <Card title="Certifications">
        <div className="mt-3">
          <label className="block text-xs font-medium text-slate-600 mb-1">List your certifications (one per line)</label>
          <textarea
            value={data.certifications}
            onChange={(e) => set("certifications", e.target.value)}
            rows={4}
            placeholder="AWS Certified Solutions Architect – 2024&#10;Google Data Analytics Certificate – 2023&#10;Meta Front-End Developer – 2023"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder:text-slate-300 resize-none"
          />
        </div>
      </Card>

      {/* Download button */}
      <button
        onClick={onDownload}
        className="w-full flex items-center justify-center gap-2 py-3.5 px-6 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 2v8M5 7l3 3 3-3M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1"/>
        </svg>
        Download Resume as PDF
      </button>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────── */
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder:text-slate-300 transition-shadow"
      />
    </div>
  );
}

function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="mt-3 flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors"
    >
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M7.5 2v11M2 7.5h11"/>
      </svg>
      {label}
    </button>
  );
}

function RemoveBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={`Remove ${label}`}
      className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M1 1l10 10M11 1L1 11"/>
      </svg>
    </button>
  );
}
