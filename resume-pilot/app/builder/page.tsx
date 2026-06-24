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

  // 💡 DETACHED SNAPSHOT PRINT ENGINE (CRASH-PROOF)
  const handleDownload = async () => {
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      // 1. Create an isolated off-screen wrapper to clear Tailwind v4 lab/oklch spaces
      const printWrapper = document.createElement("div");
      printWrapper.style.position = "absolute";
      printWrapper.style.left = "-9999px";
      printWrapper.style.top = "0px";
      printWrapper.style.width = "794px"; // Standard A4 Width at 96 DPI
      printWrapper.style.backgroundColor = "#ffffff";
      printWrapper.style.color = "#000000";

      // 2. Clone the inner template markup directly into our safe wrapper
      if (previewRef.current) {
        printWrapper.innerHTML = previewRef.current.innerHTML;

        // Strip any dangerous styles manually from the inner elements before processing
        printWrapper.querySelectorAll("*").forEach((node) => {
          const el = node as HTMLElement;
          el.style.animation = "none";
          el.style.transition = "none";
          // If any child template container has native modern inline backgrounds, fall back to safe Hex
          if (el.style.backgroundColor.includes("lab") || el.style.backgroundColor.includes("oklch")) {
            el.style.backgroundColor = "#ffffff";
          }
        });

        document.body.appendChild(printWrapper);
      } else {
        throw new Error("Canvas source element context missing.");
      }

      // 3. Point html2canvas to the sanitized off-screen container
      const canvas = await html2canvas(printWrapper, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      // 4. Cleanup the temporary wrapper immediately
      document.body.removeChild(printWrapper);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${data.fullName.trim().replace(/\s+/g, "_") || "ResumePilot_Build"}.pdf`);
    } catch (err) {
      console.error("Detached print routine error:", err);
      alert("PDF compilation failed due to styles conflict. Please check your data fields.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-900 text-slate-100 overflow-hidden">
      <Navbar />

      {/* 💻 MODERN SPLIT SCREEN INTERACTIVE WORKSPACE */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* LEFT VIEW: Scrollable Data Input Matrix */}
        <div
          className={`w-full lg:w-1/2 flex flex-col h-full bg-slate-950 border-r border-slate-800 ${activeTab === "preview" ? "hidden lg:flex" : "flex"
            }`}
        >
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/40 flex justify-between items-center shrink-0">
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Resume Core Engine
              </h1>
              <p className="text-xs text-slate-400">Fill in your information fields below.</p>
            </div>

            {/* Mobile View Tab Controls */}
            <div className="lg:hidden flex rounded-lg border border-slate-800 p-1 bg-slate-950">
              <button
                onClick={() => setActiveTab("form")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${activeTab === "form" ? "bg-blue-600 text-white" : "text-slate-400"}`}
              >
                Inputs
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${activeTab === "preview" ? "bg-blue-600 text-white" : "text-slate-400"}`}
              >
                Preview & Score
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-950/20">
            <BuilderForm
              data={data}
              onChange={setData}
              template={template}
              onTemplateChange={setTemplate}
              onDownload={handleDownload}
            />
          </div>
        </div>

        {/* RIGHT VIEW: Independent Live Preview & Score Metrics */}
        <div
          className={`w-full lg:w-1/2 flex flex-col h-full bg-slate-900/60 ${activeTab === "form" ? "hidden lg:flex" : "flex"
            }`}
        >
          {/* Real-time ATS Analytics Header Panel */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/40 shrink-0">
            <HealthReport data={data} atsScore={atsResult.totalScore} />
          </div>

          {/* Document Render Isolation Layer */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-start bg-slate-900/20 custom-scrollbar">
            <div className="w-full max-w-[800px] bg-white shadow-2xl border border-slate-200 rounded-sm overflow-hidden p-0 shrink-0">
              {/* This node serves as our clean target context markup provider */}
              <div ref={previewRef} className="w-full bg-white text-slate-900">
                <ResumePreview data={data} template={template} />
              </div>
            </div>
          </div>

          {/* Persistent Action Footer Link */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 shrink-0 flex gap-4">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              {downloading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Isolating Styles Map...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 2v8M5 7l3 3 3-3M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1" />
                  </svg>
                  Download Clear Digital PDF
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}