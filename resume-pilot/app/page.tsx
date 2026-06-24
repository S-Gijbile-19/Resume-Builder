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

  // 💡 NATIVE PRINT MATRIX BYPASS ENGINE
  const handleDownload = () => {
    setDownloading(true);
    try {
      const previewElement = previewRef.current;
      if (!previewElement) {
        alert("Preview container wrapper not mounted.");
        return;
      }

      // 1. Open an isolated empty print window context
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("Popup blocked! Please allow popups to export your resume PDF.");
        return;
      }

      // 2. Fetch all document stylesheets so fonts and structures mirror perfectly
      let stylesMarkup = "";
      document.querySelectorAll("link[rel='stylesheet'], style").forEach((styleNode) => {
        stylesMarkup += styleNode.outerHTML;
      });

      // 3. Inject clean isolated container markup with strict print styles forced inline
      printWindow.document.write(`
        <html>
          <head>
            <title>${data.fullName || "Resume"}_CV</title>
            ${stylesMarkup}
            <style>
              /* Force clean print rendering context */
              @media print {
                body {
                  background-color: #ffffff !important;
                  color: #000000 !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                html, body {
                  width: 210mm;
                  height: 297mm;
                  overflow: hidden;
                }
              }
              body {
                padding: 0;
                margin: 0;
                background-color: #ffffff;
              }
              /* Strip out interactive helper margins if any inside cloned scope */
              #resume-preview-root {
                box-shadow: none !important;
                border: none !important;
                width: 100% !important;
              }
            </style>
          </head>
          <body>
            <div style="width: 100%; max-width: 800px; margin: 0 auto;">
              ${previewElement.innerHTML}
            </div>
            <script>
              // Trigger target browser save context as soon as resources load up
              window.onload = function() {
                window.print();
                setTimeout(function() { window.close(); }, 500);
              };
            </script>
          </body>
        </html>
      `);

      printWindow.document.close();
    } catch (err) {
      console.error("Native window subsystem error:", err);
      alert("Native print engine integration failed.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-900 text-slate-100 overflow-hidden">
      <Navbar />

      {/* 💻 MODERN SPLIT SCREEN INTERACTIVE WORKSPACE */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* LEFT COMPONENT: Input Forms Area */}
        <div
          className={`w-full lg:w-1/2 flex flex-col h-full bg-slate-950 border-r border-slate-800 ${activeTab === "preview" ? "hidden lg:flex" : "flex"
            }`}
        >
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/40 flex justify-between items-center shrink-0">
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Resume Core Engine
              </h1>
              <p className="text-xs text-slate-400">Fill in your data parameters below.</p>
            </div>

            {/* Mobile Navigation Interface Link Matrix */}
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

        {/* RIGHT COMPONENT: Live Render Preview + Score Metrics Display */}
        <div
          className={`w-full lg:w-1/2 flex flex-col h-full bg-slate-900/60 ${activeTab === "form" ? "hidden lg:flex" : "flex"
            }`}
        >
          {/* Live ATS Performance Indicator Layer */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/40 shrink-0">
            <HealthReport data={data} atsScore={atsResult.totalScore} />
          </div>

          {/* Core Viewport Preview Isolation Deck */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-start bg-slate-900/20 custom-scrollbar">
            <div className="w-full max-w-[800px] bg-white shadow-2xl border border-slate-200 rounded-sm overflow-hidden p-0 shrink-0">
              <div ref={previewRef} className="w-full bg-white text-slate-900">
                <ResumePreview data={data} template={template} />
              </div>
            </div>
          </div>

          {/* Bottom Action Console Container */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 shrink-0 flex gap-4">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg transition-all duration-200"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 2v8M5 7l3 3 3-3M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1" />
              </svg>
              Save as Print-Ready PDF
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}