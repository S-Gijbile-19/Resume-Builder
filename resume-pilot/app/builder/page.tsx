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

  // 💡 FIXED DYNAMIC CONTAINER PRINT MATRIX FOR EXTENSIONS (CLEARS ALL OKLCH/LAB ERRORS)
  const handleDownload = async () => {
    setDownloading(true);
    try {
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
        onclone: (clonedDoc: Document) => {
          clonedDoc.querySelectorAll("*").forEach((el) => {
            const htmlEl = el as HTMLElement;
            htmlEl.style.animation = "none";
            htmlEl.style.transition = "none";

            const computedStyle = window.getComputedStyle(htmlEl);
            if (computedStyle.backgroundColor.includes("lab(") || computedStyle.backgroundColor.includes("oklch(")) {
              htmlEl.style.backgroundColor = "#ffffff";
            }
            if (computedStyle.color.includes("lab(") || computedStyle.color.includes("oklch(")) {
              htmlEl.style.color = "#1f2937";
            }
            if (htmlEl.style.backgroundImage?.includes("lab(") || htmlEl.style.backgroundImage?.includes("oklch(")) {
              htmlEl.style.backgroundImage = "none";
            }
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
      alert("PDF export failed. Please verify configurations layout context.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <Navbar />

      {/* 💻 TRUE SPLIT SCREEN LAYOUT WRAPPER CONTROLLER */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

        {/* Left Side Panel — Typing Content Inputs Section */}
        <div
          className={`w-full lg:w-1/2 flex flex-col h-full bg-white border-r border-slate-200 ${activeTab === "preview" ? "hidden lg:flex" : "flex"
            }`}
        >
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
            <div>
              <h1 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Resume Data Core
              </h1>
              <p className="text-xs text-slate-500">Modify your data field inputs components below.</p>
            </div>

            {/* Mobile Navigation Interface Link Matrix */}
            <div className="lg:hidden flex rounded-md border border-slate-200 p-1 bg-white">
              <button
                onClick={() => setActiveTab("form")}
                className={`px-3 py-1 text-xs font-semibold rounded-md ${activeTab === "form" ? "bg-blue-600 text-white" : "text-slate-600"}`}
              >
                Inputs View
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1 text-xs font-semibold rounded-md ${activeTab === "preview" ? "bg-blue-600 text-white" : "text-slate-600"}`}
              >
                Live Preview
              </button>
            </div>
          </div>

          {/* Scrolling Panel Form Entry Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            <BuilderForm
              data={data}
              onChange={setData}
              template={template}
              onTemplateChange={setTemplate}
              onDownload={handleDownload}
            />
          </div>
        </div>

        {/* Right Side Panel — Live Resume Mirror Preview & Real-time ATS Analytics Progress */}
        <div
          className={`w-full lg:w-1/2 flex flex-col h-full bg-slate-100/60 ${activeTab === "form" ? "hidden lg:flex" : "flex"
            }`}
        >
          {/* Real-time Score Tracking Header Node */}
          <div className="p-4 border-b border-slate-200 bg-white shadow-sm shrink-0">
            <HealthReport data={data} atsScore={atsResult.totalScore} />
          </div>

          {/* Mirror Render Layout Area */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-start custom-scrollbar">
            <div className="w-full max-w-[820px] bg-white shadow-xl border border-slate-200 rounded-sm overflow-x-auto">
              <div className="min-w-[760px]">
                <ResumePreview data={data} template={template} previewRef={previewRef} />
              </div>
            </div>
          </div>

          {/* Sticky Document Vector Stream Compiler Trigger Footer */}
          <div className="p-4 bg-white border-t border-slate-200 shrink-0 flex gap-4">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {downloading ? "Compiling Document Matrix..." : "Download Export-Ready PDF"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}