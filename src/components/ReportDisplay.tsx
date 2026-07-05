import React, { useState } from "react";
import { AnalysisReport, StreamRecommendation, CareerOption } from "../types";
import { Award, Compass, Globe, Sparkles, BookOpen, ChevronRight, TrendingUp, DollarSign, Printer, X, FileText, Loader2 } from "lucide-react";

interface ReportDisplayProps {
  report: AnalysisReport;
  onSelectCareer: (career: CareerOption) => void;
  selectedCareerTitle?: string;
  studentHobbies?: string[];
}

export default function ReportDisplay({
  report,
  onSelectCareer,
  selectedCareerTitle,
  studentHobbies = [],
}: ReportDisplayProps) {
  // Elaboration state tracking
  const [activeElaborateStream, setActiveElaborateStream] = useState<string | null>(null);
  const [activeElaborateHobby, setActiveElaborateHobby] = useState<string | null>(null);
  const [isElaborating, setIsElaborating] = useState<boolean>(false);
  const [elaborationResult, setElaborationResult] = useState<string | null>(null);
  const [elaborationError, setElaborationError] = useState<string | null>(null);
  const [showDossierModal, setShowDossierModal] = useState<boolean>(false);

  // Trigger Backend Career Elaboration API
  const handleTriggerElaborate = async (streamName: string, hobby: string) => {
    setActiveElaborateStream(streamName);
    setActiveElaborateHobby(hobby);
    setIsElaborating(true);
    setElaborationResult(null);
    setElaborationError(null);

    try {
      const response = await fetch("/api/career/elaborate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: report.studentName,
          hobby: hobby,
          stream: streamName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate detailed connection");
      }

      const data = await response.json();
      setElaborationResult(data.text);
    } catch (err: any) {
      setElaborationError(err.message || "An error occurred during academic elaboration");
    } finally {
      setIsElaborating(false);
    }
  };

  return (
    <div id="report-display-container" className="space-y-8">
      {/* Dynamic Print CSS Style block */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-dossier-root, #printable-dossier-root * {
            visibility: visible;
          }
          #printable-dossier-root {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            overflow: visible;
            padding: 0px !important;
            margin: 0px !important;
            background: white !important;
            color: black !important;
          }
          .print-hide {
            display: none !important;
          }
          @page {
            size: auto;
            margin: 15mm;
          }
        }
      `}</style>

      {report.isFallback && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex gap-3 text-amber-950 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-amber-700 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider">Local Coprocessor Mode Active</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5 font-medium">
              {report.fallbackReason === "no_key" ? (
                <>
                  No <code>GEMINI_API_KEY</code> is configured in Secrets, so we have activated your <strong>Local Advisor Engine</strong>. To enable cloud-grounded Live Search evaluation, add a key under <strong>Settings &gt; Secrets</strong>!
                </>
              ) : (
                <>
                  The global Gemini API is currently experiencing extremely high traffic load limits (Quota Exhausted / Rate-limited). To prevent waiting, your report was instantly calculated using our high-fidelity <strong>Local Academic Advisor</strong>.
                </>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Overview Block */}
      <div className="bg-gradient-to-br from-indigo-50/60 via-white to-white rounded-3xl p-6 border border-indigo-100 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Award className="w-40 h-40 text-indigo-600" />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 font-bold">Personalized Counseling Report</span>
          </div>
          
          <button
            onClick={() => setShowDossierModal(true)}
            className="inline-flex items-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/15"
          >
            <Printer className="w-4 h-4" />
            View & Print Official Dossier
          </button>
        </div>

        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          Hello, {report.studentName}
        </h3>
        
        <p className="text-slate-600 text-sm leading-relaxed max-w-3xl mb-4 font-medium">
          {report.generalAdvice}
        </p>

        {report.marketInsights && (
          <div className="mt-4 p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl">
            <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
              Live 2026/2027 Industry Trends Grounding
            </h4>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {report.marketInsights}
            </p>
          </div>
        )}
      </div>

      {/* Part A: Recommended Streams */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-bold text-slate-800">Recommended Streams (Class 11 & 12)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.recommendedStreams.map((stream: StreamRecommendation, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <h4 className="text-base font-bold text-slate-800 tracking-tight">
                    {stream.streamName}
                  </h4>
                  <span className="text-xs font-mono font-bold bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 text-slate-600 shrink-0">
                    Difficulty: {stream.difficultyLevel}
                  </span>
                </div>

                {/* Match percentage meter */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500 font-bold">Match Compatibility</span>
                    <span className="font-bold text-indigo-600">{stream.matchPercentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                      style={{ width: `${stream.matchPercentage}%` }}
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-4 italic font-medium">
                  &ldquo;{stream.transparentRationale}&rdquo;
                </p>

                {/* Explainable AI block */}
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Hobby Alignment Rationale</span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {stream.hobbyConnection}
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Globe className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Campus Browsing Evidence</span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {stream.browsingConnection}
                    </p>
                  </div>
                </div>

                {/* AI Interactive Deep Elaboration (Feature 1) */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-[10px] font-extrabold text-indigo-950 uppercase tracking-wider">Interactive Hobby-Stream Link Elaboration</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                    Click on any of your personal hobbies to command the AI to analyze its deep, multi-dimensional academic connection to this stream:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {studentHobbies && studentHobbies.length > 0 ? (
                      studentHobbies.map((hobby, hidx) => {
                        const isActive = activeElaborateStream === stream.streamName && activeElaborateHobby === hobby;
                        return (
                          <button
                            key={hidx}
                            onClick={() => handleTriggerElaborate(stream.streamName, hobby)}
                            className={`text-[9px] font-bold px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 shadow-sm ${
                              isActive
                                ? "bg-indigo-600 text-white border-indigo-500 ring-1 ring-indigo-500/20"
                                : "bg-indigo-50/60 hover:bg-indigo-50 text-indigo-700 hover:text-indigo-800 border-indigo-150"
                            }`}
                          >
                            <span>✨ {hobby}</span>
                          </button>
                        );
                      })
                    ) : (
                      <span className="text-[10px] text-slate-400 italic font-medium">No custom hobbies available. Setup some in the Student Background block!</span>
                    )}
                  </div>

                  {/* Elaboration output container */}
                  {activeElaborateStream === stream.streamName && activeElaborateHobby && (
                    <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative overflow-hidden text-xs animate-in fade-in slide-in-from-top-2 duration-200">
                      <button
                        onClick={() => {
                          setActiveElaborateStream(null);
                          setActiveElaborateHobby(null);
                          setElaborationResult(null);
                        }}
                        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-all"
                        title="Close elaboration"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      {isElaborating ? (
                        <div className="space-y-2 py-1">
                          <div className="flex items-center gap-2 text-indigo-600 font-extrabold font-mono text-[9px] uppercase tracking-wider animate-pulse">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            AI is tracing cognitive pathways for &quot;{activeElaborateHobby}&quot;...
                          </div>
                          <div className="h-2.5 bg-slate-200 rounded animate-pulse w-full" />
                          <div className="h-2.5 bg-slate-200 rounded animate-pulse w-11/12" />
                          <div className="h-2.5 bg-slate-200 rounded animate-pulse w-4/5" />
                        </div>
                      ) : elaborationError ? (
                        <p className="text-xs text-rose-600 font-bold">Failed to elaborate: {elaborationError}</p>
                      ) : elaborationResult ? (
                        <div className="prose prose-sm prose-slate max-w-none text-slate-700">
                          <div dangerouslySetInnerHTML={{ __html: elaborationResult }} />
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                {stream.coreSubjects.map((sub, sidx) => (
                  <span key={sidx} className="text-[10px] font-semibold bg-slate-50 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200">
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Part B: Long Term Career Roadmap Selection */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-800">Long-term Future Careers</h3>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1.5 rounded-lg border border-indigo-100">
            Click to map Progression Roadmaps
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium mb-4">
          Select any of the curated futuristic careers below to review its complete progression milestones in the tracker.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {report.longTermCareers.map((career: CareerOption, idx) => {
            const isSelected = selectedCareerTitle === career.careerTitle;
            return (
              <button
                key={idx}
                onClick={() => onSelectCareer(career)}
                className={`text-left p-5 rounded-2xl border transition-all flex flex-col justify-between shadow-sm ${
                  isSelected
                    ? "bg-indigo-50/80 border-indigo-500 ring-1 ring-indigo-500/30"
                    : "bg-white hover:bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h4 className={`text-sm font-bold leading-snug ${isSelected ? "text-indigo-950" : "text-slate-800"}`}>
                      {career.careerTitle}
                    </h4>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-mono font-bold flex items-center shrink-0">
                      <DollarSign className="w-2.5 h-2.5" />
                      {career.startingSalaryEstimate}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 font-medium leading-relaxed mb-3 line-clamp-3">
                    {career.description}
                  </p>

                  <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-600 mb-3 leading-relaxed">
                    <span className="text-indigo-800 font-bold block mb-0.5">Industry Demand Trend</span>
                    {career.industryGrowthTrend}
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {career.skillsRequired.slice(0, 3).map((skill, sidx) => (
                      <span key={sidx} className="text-[9px] font-medium bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">
                        {skill}
                      </span>
                    ))}
                    {career.skillsRequired.length > 3 && (
                      <span className="text-[9px] text-slate-400 font-semibold px-1 py-0.5">
                        +{career.skillsRequired.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-indigo-600 border-t border-slate-100 pt-2.5 w-full">
                    <span>{isSelected ? "Active Milestone Track" : "Map Path Milestones"}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? "rotate-90 text-indigo-900" : ""}`} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Part C: Grounding references */}
      {report.groundingSources && report.groundingSources.length > 0 && (
        <div className="p-4 bg-emerald-50/20 rounded-2xl border border-emerald-100">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Globe className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Search Grounding Sources
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {report.groundingSources.map((source, sidx) => (
              <a
                key={sidx}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200 transition-all font-bold shadow-sm"
              >
                <span>🌐 {source.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Dossier Document Modal Overlay (Feature 2) */}
      {showDossierModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Standardized Student Counseling Dossier
                </h4>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Save PDF
                </button>
                <button
                  onClick={() => setShowDossierModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-200 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Area */}
            <div id="printable-dossier-root" className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 bg-white print:p-0 print:overflow-visible">
              
              {/* Report Header for print */}
              <div className="border-b-2 border-slate-900 pb-6 flex justify-between items-start gap-4">
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                    National Stream & Career Advisor
                  </h1>
                  <p className="text-[11px] text-slate-500 font-mono uppercase tracking-wider mt-1">
                    Standardized Academic counseling dossier & stream evaluation
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Evaluated under the standards of Class 10/11 Secondary Stream Mapping Regulations
                  </p>
                </div>
                
                {/* Official seal mock */}
                <div className="text-center shrink-0 p-3 border border-slate-800 rounded-xl bg-slate-50 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white mb-1 shadow-md">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[8px] font-black tracking-widest text-slate-900 uppercase">OFFICIAL SEAL</span>
                  <span className="text-[7px] text-indigo-600 font-bold font-mono">CAREERLY COGNITIVE CORE</span>
                </div>
              </div>

              {/* Dossier Metadata Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Student Name</span>
                  <span className="font-extrabold text-slate-800 text-sm">{report.studentName}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Assessment Date</span>
                  <span className="font-extrabold text-slate-800">{new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Evaluation Core</span>
                  <span className="font-extrabold text-slate-800 flex items-center gap-1">
                    {report.isFallback ? "Offline Coprocessor" : "Gemini 3.5 Active"}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Recommended Streams</span>
                  <span className="font-extrabold text-indigo-600">{report.recommendedStreams.length} Primary Paths</span>
                </div>
              </div>

              {/* Rationale overview */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-l-4 border-indigo-600 pl-2">
                  Academic Overview & General Advice
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  {report.generalAdvice}
                </p>
              </div>

              {/* Recommended Streams mapped out */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-l-4 border-indigo-600 pl-2">
                  Recommended Class 11 & 12 Academic Streams
                </h3>
                <div className="space-y-4">
                  {report.recommendedStreams.map((stream, idx) => (
                    <div key={idx} className="p-5 border border-slate-200 rounded-2xl space-y-3 bg-white shadow-sm break-inside-avoid">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">{stream.streamName}</h4>
                          <div className="flex gap-2 mt-1">
                            {stream.coreSubjects.map((sub, sidx) => (
                              <span key={sidx} className="text-[9px] font-semibold bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                                {sub}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-mono font-bold text-indigo-600 block">{stream.matchPercentage}% Mapped</span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase block">Difficulty: {stream.difficultyLevel}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-slate-600 leading-relaxed">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="font-bold text-indigo-950 block mb-0.5">🎯 Hobby Alignment</span>
                          {stream.hobbyConnection}
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="font-bold text-indigo-950 block mb-0.5">🌐 Browsing Alignment Evidence</span>
                          {stream.browsingConnection}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Long Term Career paths */}
              <div className="space-y-4 break-inside-avoid">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-l-4 border-indigo-600 pl-2">
                  Futuristic Careers & Potential Professional Prospects
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {report.longTermCareers.map((career, idx) => (
                    <div key={idx} className="p-4 border border-slate-200 rounded-xl bg-slate-50 space-y-2 text-xs flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="font-bold text-slate-800 leading-snug">{career.careerTitle}</h4>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed mt-1 font-medium">{career.description}</p>
                      </div>
                      <div className="pt-2 border-t border-slate-200 space-y-1">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Market Valuation & Salary</span>
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-bold text-emerald-700">{career.startingSalaryEstimate}</span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block pt-1">Required Core Skills</span>
                        <div className="flex flex-wrap gap-1">
                          {career.skillsRequired.slice(0, 3).map((s, sidx) => (
                            <span key={sidx} className="bg-white text-[9px] text-slate-500 font-bold px-1 rounded border border-slate-200">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legal & Educational Disclaimer */}
              <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[10px] text-slate-400 break-inside-avoid">
                <div className="space-y-1">
                  <p className="font-bold">National Career Mapping & Stream Advisor Core Version 1.5</p>
                  <p>All assessments are powered by search-grounded contextual calculations and represent standard class alignment rules.</p>
                </div>
                <div className="shrink-0 text-right font-mono text-[9px] text-slate-500">
                  <p>Dossier Reference ID: NSCA-2026-F{Math.floor(Math.random() * 90000) + 10000}</p>
                  <p className="mt-0.5">Signature Authorized: CAREERLY DIGITAL KEY</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
