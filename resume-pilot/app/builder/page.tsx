"use client";

import { useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BuilderForm from "@/components/BuilderForm";
import ResumePreview from "@/components/ResumePreview";
import HealthReport from "@/components/HealthReport";
import { ResumeData, TemplateType } from "@/types/resume";
import { resumeDataToText, calculateATSScore } from "@/lib/ats";

const defaultData: ResumeData = {
  documentType: "resume",
  fullName: "",
  email: "",
  phone: "",
  linkedin: "",
  address: "",
  summary: "",
  education: [{ id: "edu-1", institution: "", degree: "", field: "", startYear: "", endYear: "", gpa: "" }],
  skills: "",
  projects: [{ id: "proj-1", name: "", description: "", technologies: "", link: "" }],
  experience: [{ id: "exp-1", company: "", role: "", startDate: "", endDate: "", description: "", current: false }],
  certifications: "",
  achievements: "",
  languages: "",
  publications: "",
  additionalDetails: "",
};

export default function BuilderPage() {
  const [data, setData] = useState<ResumeData>(defaultData);
  const [template, setTemplate] = useState<TemplateType>("modern");
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");
  const previewRef = useRef<HTMLDivElement>(null);

  const resumeText = resumeDataToText(data);
  const atsResult = calculateATSScore(resumeText);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Switch to preview tab on mobile so the ref is rendered
      if (window.innerWidth < 1024) setActiveTab("preview");
      await new Promise((r) => setTimeout(r, 300));

      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const element = previewRef.current;
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: "#ffffff",
        foreignObjectRendering: false,
        removeContainer: true,
        onclone: (doc) => {
          doc.querySelectorAll("*").forEach((el) => {
            const htmlEl = el as HTMLElement;
            htmlEl.style.animation = "none";
            htmlEl.style.transition = "none";
          });
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${data.fullName.trim().replace(/\s+/g, "_") || "resume"}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("PDF export failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      {/* Page header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Resume Builder
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Fill in your details on the left and see a live preview on the right.
          </p>
        </div>
      </div>

      {/* Mobile tab switcher */}
      <div className="lg:hidden bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 flex gap-0">
          {(["form", "preview"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-all ${activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
            >
              {tab === "form" ? "Edit" : "Preview"}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8 items-start">
          {/* Left — form */}
          <div className={`w-full lg:w-[45%] xl:w-[42%] ${activeTab === "preview" ? "hidden lg:block" : "block"}`}>
            <BuilderForm
              data={data}
              onChange={setData}
              template={template}
              onTemplateChange={setTemplate}
              onDownload={handleDownload}
            />
            {downloading && (
              <div className="mt-4 flex items-center gap-2 text-sm text-blue-600 animate-pulse">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 2a6 6 0 100 12A6 6 0 008 2z" strokeOpacity="0.3" />
                  <path d="M14 8a6 6 0 00-6-6" strokeLinecap="round" />
                </svg>
                Generating PDF…
              </div>
            )}
          </div>

          {/* Right — preview + health */}
          <div className={`w-full lg:flex-1 space-y-6 ${activeTab === "form" ? "hidden lg:block" : "block"}`}>
            {/* Health Report */}
            <HealthReport data={data} atsScore={atsResult.totalScore} />

            {/* Live preview */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Live Preview</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
              </div>
              <div className="overflow-auto max-h-[860px]">
                <div className="min-w-[600px]">
                  <ResumePreview data={data} template={template} previewRef={previewRef} />
                </div>
              </div>
            </div>

            {/* Download button (sticky on right side) */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {downloading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 2a6 6 0 100 12" strokeLinecap="round" />
                  </svg>
                  Generating PDF…
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 2v8M5 7l3 3 3-3M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1" />
                  </svg>
                  Download as PDF
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
