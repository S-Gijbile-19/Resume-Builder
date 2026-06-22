"use client";

import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { analyzeResumeText } from "@/lib/ats";
import { AdvancedAnalysisResult } from "@/types/resume";

export default function ATSCheckerPage() {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState<AdvancedAnalysisResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [activeInputTab, setActiveInputTab] = useState<"upload" | "paste">("upload");
  const [activeResultTab, setActiveResultTab] = useState<"overview" | "breakdown" | "suggestions">("overview");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic script loader for PDFJS
  const loadPdfJs = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if ((window as any).pdfjsLib) {
        resolve((window as any).pdfjsLib);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
      script.onload = () => {
        const pdfjsLib = (window as any).pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
        resolve(pdfjsLib);
      };
      script.onerror = (e) => reject(new Error("Failed to load PDF parsing engine. Check your connection."));
      document.head.appendChild(script);
    });
  };

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const pdfjs = await loadPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");
      fullText += pageText + "\n";
    }

    return fullText;
  };

  const handleFileUpload = async (file: File) => {
    setError("");
    setChecking(true);
    setResult(null);
    setFileName(file.name);

    try {
      let extractedText = "";
      if (file.type === "application/pdf") {
        extractedText = await extractTextFromPdf(file);
      } else if (file.type === "text/plain") {
        extractedText = await file.text();
      } else {
        // Fallback for file extensions
        if (file.name.endsWith(".pdf")) {
          extractedText = await extractTextFromPdf(file);
        } else if (file.name.endsWith(".txt")) {
          extractedText = await file.text();
        } else {
          throw new Error("Unsupported file format. Please upload a PDF or TXT file.");
        }
      }

      if (!extractedText.trim()) {
        throw new Error("Could not extract text from the file. Ensure it is not scanned or empty.");
      }

      setText(extractedText);
      const analysis = analyzeResumeText(extractedText);
      setResult(analysis);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to process file.");
      setFileName("");
    } finally {
      setChecking(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleManualCheck = () => {
    if (!text.trim()) return;
    setChecking(true);
    setResult(null);
    setTimeout(() => {
      try {
        const analysis = analyzeResumeText(text);
        setResult(analysis);
      } catch (err) {
        setError("Analysis failed. Please check the pasted text.");
      } finally {
        setChecking(false);
      }
    }, 600);
  };

  const handleClear = () => {
    setText("");
    setFileName("");
    setResult(null);
    setError("");
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  // Helpers for styling scores
  const getScoreColorClass = (score: number) => {
    if (score >= 75) return "text-emerald-500 stroke-emerald-500 border-emerald-500 bg-emerald-50";
    if (score >= 45) return "text-amber-500 stroke-amber-500 border-amber-500 bg-amber-50";
    return "text-red-500 stroke-red-500 border-red-500 bg-red-50";
  };

  const getBadgeColorClass = (status: "good" | "warning" | "poor") => {
    if (status === "good") return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (status === "warning") return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  // Circular progress math
  const getCircleProps = (score: number) => {
    const radius = 38;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - score / 100);
    return { radius, circumference, offset };
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white border-b border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider">
              100% Client-Side Analyzer
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Existing Resume & CV Optimizer
            </h1>
            <p className="text-slate-400 mt-2 text-sm sm:text-base leading-relaxed">
              Upload your document or paste the text to evaluate ATS compatibility, formatting quality, structure completeness, and receive interactive suggestions.
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Input form (Upload & Paste) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Input tabs */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex border-b border-slate-200 bg-slate-50">
                <button
                  onClick={() => { setActiveInputTab("upload"); setError(""); }}
                  className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition-all ${
                    activeInputTab === "upload"
                      ? "border-blue-600 text-blue-600 bg-white"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Upload Resume / CV File
                </button>
                <button
                  onClick={() => { setActiveInputTab("paste"); setError(""); }}
                  className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition-all ${
                    activeInputTab === "paste"
                      ? "border-blue-600 text-blue-600 bg-white"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Paste Plain Text
                </button>
              </div>

              <div className="p-5">
                {/* Upload Section */}
                {activeInputTab === "upload" && (
                  <div className="space-y-4">
                    <div
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-blue-50/20 group"
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                        accept=".pdf,.txt"
                        className="hidden"
                      />
                      <div className="w-14 h-14 rounded-full bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors mb-3 shadow-inner">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-slate-700">Drag and drop your PDF or TXT</p>
                      <p className="text-xs text-slate-400 mt-1">Files supported up to 5MB</p>
                      <button type="button" className="mt-4 px-4 py-2 text-xs font-semibold text-blue-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                        Browse Files
                      </button>
                    </div>

                    {fileName && (
                      <div className="flex items-center justify-between p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-xs text-blue-800">
                        <div className="flex items-center gap-2 truncate">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-blue-600 shrink-0">
                            <path d="M9 1.5H2.5A1.5 1.5 0 001 3v10a1.5 1.5 0 001.5 1.5h11A1.5 1.5 0 0015 13V7.5L9 1.5z"/>
                            <path d="M9 1.5V6a1.5 1.5 0 001.5 1.5H15"/>
                          </svg>
                          <span className="font-semibold truncate">{fileName}</span>
                        </div>
                        <button
                          onClick={handleClear}
                          className="p-1 rounded-full hover:bg-blue-100 text-blue-600 transition-colors"
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M1 1l10 10M11 1L1 11"/>
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Paste Section */}
                {activeInputTab === "paste" && (
                  <div className="space-y-4">
                    <textarea
                      value={text}
                      onChange={(e) => { setText(e.target.value); setResult(null); setError(""); }}
                      rows={14}
                      placeholder="Paste the plain text of your resume or CV here..."
                      className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-300 resize-none bg-slate-50/50 transition-shadow font-mono"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">{wordCount} words</span>
                      <div className="flex gap-2">
                        {text && (
                          <button
                            onClick={handleClear}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
                          >
                            Clear
                          </button>
                        )}
                        <button
                          onClick={handleManualCheck}
                          disabled={!text.trim() || checking}
                          className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          {checking ? "Analyzing…" : "Check ATS & Health"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {error && (
                  <div className="mt-4 p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex gap-2 animate-shake">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-red-500 shrink-0">
                      <circle cx="8" cy="8" r="7"/>
                      <path d="M8 5v4M8 11h.01"/>
                    </svg>
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Analysis details info */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Analysis Criteria</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our checker runs structural keyword searches and formatting tests directly in your browser. We check for key credentials, LinkedIn metrics, action verbs, resume length, and quantified achievements.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Contact Quality
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Education Scan
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Skills Density
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Measurable Impact
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Action Verb Count
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Formatting & Length
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Dashboard & Analysis Results */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Empty state */}
            {!result && !checking && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 text-slate-300 shadow-sm">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M3 9h18M9 21V9M14 14h3M14 17h3M6 14h.01M6 17h.01"/>
                  </svg>
                </div>
                <h3 className="text-base font-bold text-slate-700">Awaiting Upload or Text Input</h3>
                <p className="text-xs text-slate-400 mt-2 max-w-sm leading-relaxed">
                  Upload your resume/CV as a PDF/TXT or paste the plain text inside the input card on the left. The health analysis dashboard will populate here immediately.
                </p>
              </div>
            )}

            {/* Checking state */}
            {checking && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 flex flex-col items-center text-center">
                <div className="relative w-16 h-16 mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
                  <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                </div>
                <h3 className="text-base font-bold text-slate-700">Analyzing Document</h3>
                <p className="text-xs text-slate-400 mt-1">Extracting plain text & evaluating content against ATS standards…</p>
              </div>
            )}

            {/* Dashboard results */}
            {result && !checking && (
              <div className="space-y-6 animate-fade-in">
                
                {/* 3 Circular Gauges */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-3">Resume Metrics Dashboard</h3>
                  <div className="grid grid-cols-3 gap-4 pt-5">
                    
                    {/* Gauge 1: Strength Score */}
                    <div className="flex flex-col items-center text-center">
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="8"/>
                          <circle
                            cx="50" cy="50" r="38" fill="none"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={getCircleProps(result.strengthScore).circumference}
                            strokeDashoffset={getCircleProps(result.strengthScore).offset}
                            className={`transition-all duration-1000 ${getScoreColorClass(result.strengthScore).split(" ")[1]}`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className={`text-xl sm:text-2xl font-black ${getScoreColorClass(result.strengthScore).split(" ")[0]}`}>{result.strengthScore}</span>
                          <span className="text-[9px] text-slate-400 -mt-1">/ 100</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-slate-700 mt-2.5">Strength Score</span>
                    </div>

                    {/* Gauge 2: ATS Score */}
                    <div className="flex flex-col items-center text-center">
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="8"/>
                          <circle
                            cx="50" cy="50" r="38" fill="none"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={getCircleProps(result.atsScore).circumference}
                            strokeDashoffset={getCircleProps(result.atsScore).offset}
                            className={`transition-all duration-1000 ${getScoreColorClass(result.atsScore).split(" ")[1]}`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className={`text-xl sm:text-2xl font-black ${getScoreColorClass(result.atsScore).split(" ")[0]}`}>{result.atsScore}</span>
                          <span className="text-[9px] text-slate-400 -mt-1">/ 100</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-slate-700 mt-2.5">ATS Score</span>
                    </div>

                    {/* Gauge 3: Completion */}
                    <div className="flex flex-col items-center text-center">
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="8"/>
                          <circle
                            cx="50" cy="50" r="38" fill="none"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={getCircleProps(result.completionPercentage).circumference}
                            strokeDashoffset={getCircleProps(result.completionPercentage).offset}
                            className={`transition-all duration-1000 ${getScoreColorClass(result.completionPercentage).split(" ")[1]}`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className={`text-xl sm:text-2xl font-black ${getScoreColorClass(result.completionPercentage).split(" ")[0]}`}>{result.completionPercentage}%</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-slate-700 mt-2.5">Completion</span>
                    </div>

                  </div>
                </div>

                {/* Tab layout for Details */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="flex border-b border-slate-100 bg-slate-50/50">
                    <button
                      onClick={() => setActiveResultTab("overview")}
                      className={`flex-1 py-3 text-center text-xs font-semibold border-b-2 transition-all ${
                        activeResultTab === "overview"
                          ? "border-blue-600 text-blue-600 bg-white"
                          : "border-transparent text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      Strengths & Weaknesses
                    </button>
                    <button
                      onClick={() => setActiveResultTab("suggestions")}
                      className={`flex-1 py-3 text-center text-xs font-semibold border-b-2 transition-all ${
                        activeResultTab === "suggestions"
                          ? "border-blue-600 text-blue-600 bg-white"
                          : "border-transparent text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      Improvement Suggestions ({result.recommendations.length})
                    </button>
                    <button
                      onClick={() => setActiveResultTab("breakdown")}
                      className={`flex-1 py-3 text-center text-xs font-semibold border-b-2 transition-all ${
                        activeResultTab === "breakdown"
                          ? "border-blue-600 text-blue-600 bg-white"
                          : "border-transparent text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      Section Breakdown
                    </button>
                  </div>

                  <div className="p-5">
                    {/* Tab 1: Overview (Strengths & Weaknesses) */}
                    {activeResultTab === "overview" && (
                      <div className="space-y-5">
                        {/* Strengths */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Detected Strengths</h4>
                          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 space-y-2.5">
                            {result.strengths.length > 0 ? (
                              result.strengths.map((s, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-emerald-600 shrink-0 mt-0.5">
                                    <path d="M4 8.5l2.5 2.5 5.5-6"/>
                                  </svg>
                                  <span>{s}</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-slate-500 italic">No significant strengths detected. See suggestions to improve.</p>
                            )}
                          </div>
                        </div>

                        {/* Weaknesses */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-red-800 uppercase tracking-wider">Identified Weaknesses</h4>
                          <div className="bg-red-50/30 border border-red-100 rounded-xl p-4 space-y-2.5">
                            {result.weaknesses.length > 0 ? (
                              result.weaknesses.map((w, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-red-500 shrink-0 mt-0.5">
                                    <circle cx="8" cy="8" r="7"/>
                                    <path d="M8 5v4M8 11h.01"/>
                                  </svg>
                                  <span>{w}</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-slate-500 italic">No major structural weaknesses found!</p>
                            )}
                          </div>
                        </div>

                        {/* Missing sections */}
                        {result.missingSections.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Missing Core Sections</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {result.missingSections.map((ms, i) => (
                                <span key={i} className="px-2.5 py-1 text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 rounded-full shadow-sm">
                                  {ms}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tab 2: Suggestions */}
                    {activeResultTab === "suggestions" && (
                      <div className="space-y-4">
                        <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4">
                          <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-amber-700">
                              <path d="M8 1L1 13h14L8 1zm0 5v4m0 2h.01"/>
                            </svg>
                            Actionable Optimization Recommendations
                          </h4>
                          {result.recommendations.length > 0 ? (
                            <ul className="space-y-3">
                              {result.recommendations.map((rec, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                                    {i + 1}
                                  </span>
                                  <span className="leading-relaxed">{rec}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-emerald-800 font-medium">Your resume checks all our current standards. Excellent job!</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Tab 3: Section Breakdown */}
                    {activeResultTab === "breakdown" && (
                      <div className="space-y-4">
                        {Object.values(result.sectionBreakdown).map((sec: any, idx) => {
                          const badgeClass = getBadgeColorClass(sec.status);
                          const isSuccess = sec.status === "good";
                          const isWarning = sec.status === "warning";
                          return (
                            <div key={idx} className="p-3.5 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors bg-slate-50/30">
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-slate-800">{sec.label}</span>
                                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${badgeClass}`}>
                                    {sec.status === "good" ? "Passing" : sec.status === "warning" ? "Needs work" : "Deficient"}
                                  </span>
                                </div>
                                <span className="text-xs font-bold text-slate-700">{sec.score}/{sec.maxScore}</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-1.5">
                                <div
                                  className={`h-1.5 rounded-full transition-all duration-500 ${
                                    isSuccess ? "bg-emerald-500" : isWarning ? "bg-amber-500" : "bg-red-500"
                                  }`}
                                  style={{ width: `${(sec.score / sec.maxScore) * 100}%` }}
                                />
                              </div>
                              <p className="text-[10px] text-slate-500 mt-1.5">{sec.feedback}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>
                </div>

              </div>
            )}

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
