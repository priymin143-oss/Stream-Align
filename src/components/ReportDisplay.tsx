import React, { useState } from "react";
import { AnalysisReport, StreamRecommendation, CareerOption } from "../types";
import { Award, Compass, Globe, Sparkles, BookOpen, ChevronRight, TrendingUp, DollarSign, Printer, X, FileText, Loader2, AlertCircle } from "lucide-react";
import { generateLocalElaboration } from "../lib/fallbackGenerator";

interface ReportDisplayProps {
  report: AnalysisReport;
  onSelectCareer: (career: CareerOption) => void;
  selectedCareerTitle?: string;
  studentHobbies?: string[];
  technicalSkills?: string[];
  softSkills?: string[];
}

export default function ReportDisplay({
  report,
  onSelectCareer,
  selectedCareerTitle,
  studentHobbies = [],
  technicalSkills = [],
  softSkills = [],
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
      console.warn("Backend elaboration endpoint failed. Falling back to offline client-side alignment generator.", err);
      // Fallback to beautiful local elaboration content
      const offlineText = generateLocalElaboration(streamName, hobby, report.studentName);
      setElaborationResult(offlineText);
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



      {/* Overview Block */}
      <div className="bg-gradient-to-br from-indigo-50/60 via-white to-white dark:from-indigo-950/15 dark:via-slate-900 dark:to-slate-900 rounded-3xl p-6 border border-indigo-100 dark:border-indigo-950 relative overflow-hidden shadow-sm transition-colors duration-300">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Award className="w-40 h-40 text-indigo-600 dark:text-indigo-400" />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 dark:text-indigo-450">Personalized Counseling Report</span>
          </div>
          
          <button
            onClick={() => setShowDossierModal(true)}
            className="inline-flex items-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/15 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            View & Print Official Dossier
          </button>
        </div>

        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
          Hello, {report.studentName}
        </h3>
        
        <p className="text-slate-600 dark:text-slate-355 text-sm leading-relaxed max-w-3xl mb-4 font-medium">
          {report.generalAdvice}
        </p>

        {report.marketInsights && (
          <div className="mt-4 p-4 bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-950/40 rounded-xl">
            <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
              Live 2026/2027 Industry Trends Grounding
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-350 font-medium leading-relaxed">
              {report.marketInsights}
            </p>
          </div>
        )}
      </div>

      {/* Part A: Recommended Streams */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recommended Streams (Class 11 & 12)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.recommendedStreams.map((stream: StreamRecommendation, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 transition-colors duration-300"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <h4 className="text-base font-bold text-slate-800 dark:text-white tracking-tight">
                    {stream.streamName}
                  </h4>
                  <span className="text-xs font-mono font-bold bg-slate-50 dark:bg-slate-950 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-400 shrink-0">
                    Difficulty: {stream.difficultyLevel}
                  </span>
                </div>

                {/* Match percentage meter */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500 dark:text-slate-400 font-bold">Match Compatibility</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{stream.matchPercentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                      style={{ width: `${stream.matchPercentage}%` }}
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed mb-4 italic font-medium">
                  &ldquo;{stream.transparentRationale}&rdquo;
                </p>

                {/* Explainable AI block */}
                <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="p-3 bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
                      <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">Hobby Alignment Rationale</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-350 font-medium leading-relaxed">
                      {stream.hobbyConnection}
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50/80 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-xl">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span className="text-[10px] font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wider">Campus Browsing Evidence</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-355 font-medium leading-relaxed">
                      {stream.browsingConnection}
                    </p>
                  </div>
                </div>

                {/* AI Interactive Deep Elaboration (Feature 1) */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-[10px] font-extrabold text-indigo-950 dark:text-indigo-300 uppercase tracking-wider">Interactive Hobby-Stream Link Elaboration</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-450 leading-relaxed font-medium">
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
                            className={`text-[9px] font-bold px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                              isActive
                                ? "bg-indigo-600 text-white border-indigo-500 ring-1 ring-indigo-500/20"
                                : "bg-indigo-50/60 dark:bg-indigo-950/40 hover:bg-indigo-50 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-white border-indigo-150 dark:border-indigo-900"
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
                    <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 relative overflow-hidden text-xs animate-in fade-in slide-in-from-top-2 duration-200">
                      <button
                        onClick={() => {
                          setActiveElaborateStream(null);
                          setActiveElaborateHobby(null);
                          setElaborationResult(null);
                        }}
                        className="absolute top-2 right-2 p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                        title="Close elaboration"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      {isElaborating ? (
                        <div className="space-y-2 py-1">
                          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold font-mono text-[9px] uppercase tracking-wider animate-pulse">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            AI is tracing cognitive pathways for &quot;{activeElaborateHobby}&quot;...
                          </div>
                          <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-full" />
                          <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-11/12" />
                          <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-4/5" />
                        </div>
                      ) : elaborationError ? (
                        <p className="text-xs text-rose-600 font-bold">Failed to elaborate: {elaborationError}</p>
                      ) : elaborationResult ? (
                        <div className="prose prose-sm prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                          <div dangerouslySetInnerHTML={{ __html: elaborationResult }} />
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
                {stream.coreSubjects.map((sub, sidx) => (
                  <span key={sidx} className="text-[10px] font-semibold bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-855">
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
            <Compass className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Long-term Future Careers</h3>
          </div>
          <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-955/40 px-2.5 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900">
            Click to map Progression Roadmaps
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-4">
          Select any of the curated futuristic careers below to review its complete progression milestones in the tracker.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {report.longTermCareers.map((career: CareerOption, idx) => {
            const isSelected = selectedCareerTitle === career.careerTitle;
            return (
              <button
                key={idx}
                onClick={() => onSelectCareer(career)}
                className={`text-left p-5 rounded-2xl border transition-all flex flex-col justify-between shadow-sm cursor-pointer ${
                  isSelected
                    ? "bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-500 dark:border-indigo-400 ring-1 ring-indigo-500/30 dark:ring-indigo-400/30"
                    : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h4 className={`text-sm font-bold leading-snug ${isSelected ? "text-indigo-950 dark:text-white" : "text-slate-800 dark:text-slate-200"}`}>
                      {career.careerTitle}
                    </h4>
                    <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 px-2 py-0.5 rounded font-mono font-bold flex items-center shrink-0">
                      <DollarSign className="w-2.5 h-2.5" />
                      {career.startingSalaryEstimate}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-3 line-clamp-3">
                    {career.description}
                  </p>

                  <div className="bg-slate-50/80 dark:bg-slate-950/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-350 mb-3 leading-relaxed">
                    <span className="text-indigo-800 dark:text-indigo-400 font-bold block mb-0.5">Industry Demand Trend</span>
                    {career.industryGrowthTrend}
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {career.skillsRequired.slice(0, 3).map((skill, sidx) => (
                      <span key={sidx} className="text-[9px] font-medium bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                        {skill}
                      </span>
                    ))}
                    {career.skillsRequired.length > 3 && (
                      <span className="text-[9px] text-slate-400 dark:text-slate-550 font-semibold px-1 py-0.5">
                        +{career.skillsRequired.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 border-t border-slate-100 dark:border-slate-800 pt-2.5 w-full">
                    <span>{isSelected ? "Active Milestone Track" : "Map Path Milestones"}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? "rotate-90 text-indigo-900 dark:text-indigo-300" : ""}`} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Skill Gap Analysis & Bridging Course Suggestions */}
        {(() => {
          const selectedCareer = report.longTermCareers.find(c => c.careerTitle === selectedCareerTitle) || report.longTermCareers[0];
          if (!selectedCareer) return null;

          const required = selectedCareer.skillsRequired || [];
          const userSkillsSet = new Set([...(technicalSkills || []), ...(softSkills || [])].map(s => s.toLowerCase()));
          const matching = required.filter(s => userSkillsSet.has(s.toLowerCase()));
          const missing = required.filter(s => !userSkillsSet.has(s.toLowerCase()));
          const matchPercentage = required.length ? Math.round((matching.length / required.length) * 100) : 0;

          return (
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-3xl p-6 mt-6 space-y-4 shadow-sm animate-in fade-in duration-200 transition-colors duration-300">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-150 dark:border-slate-800 pb-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                    Interactive Skill Gap Analysis & Learning Pathways
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    Personalized comparison of required career competencies against your active skills portfolio
                  </p>
                </div>
                <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-mono font-bold px-2.5 py-1 rounded-md border border-indigo-150 dark:border-indigo-900 uppercase tracking-wider self-start sm:self-center">
                  Target: {selectedCareer.careerTitle}
                </span>
              </div>

              {/* Gap Comparison Widgets */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Meter Card */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 transition-colors duration-300">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider block">Portfolio Match Status</span>
                  
                  <div className="flex justify-between items-baseline">
                    <span className="text-2xl font-extrabold text-slate-800 dark:text-white">{matchPercentage}% Match</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{matching.length} of {required.length} skills</span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
                        matchPercentage > 75 ? 'from-emerald-500 to-teal-500' : matchPercentage > 40 ? 'from-amber-500 to-indigo-500' : 'from-indigo-500 to-blue-500'
                      }`} 
                      style={{ width: `${matchPercentage}%` }}
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    <div>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-extrabold uppercase block mb-1">Matching Skills Portfolio</span>
                      <div className="flex flex-wrap gap-1">
                        {matching.length === 0 ? (
                          <span className="text-[9px] text-slate-400 font-medium italic">No matching skills yet — start learning below!</span>
                        ) : (
                          matching.map(s => (
                            <span key={s} className="text-[9px] font-bold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded border border-emerald-100 dark:border-emerald-900/50">
                              ✓ {s}
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-[9px] text-slate-400 dark:text-slate-550 font-extrabold uppercase block mb-1">Gaps to Bridge (Unlocks Starting Salary Premium)</span>
                      <div className="flex flex-wrap gap-1">
                        {missing.length === 0 ? (
                          <span className="text-[9px] text-emerald-600 font-bold">100% Core Competencies Mastered!</span>
                        ) : (
                          missing.map(s => (
                            <span key={s} className="text-[9px] font-bold px-2 py-0.5 bg-amber-50 dark:bg-amber-955/20 text-amber-800 dark:text-amber-300 rounded border border-amber-150 dark:border-amber-900/60">
                              ⚠ {s}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Advice Card */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-colors duration-300">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-455 uppercase tracking-wider block">Advisory Rationale</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      Our dynamic system matches required technical and soft parameters. Bridging the remaining <strong className="text-amber-700 dark:text-amber-400">{missing.length} skill gaps</strong> with micro-qualifications will prepare you for top college admissions and secure an estimated <strong className="text-indigo-600 dark:text-indigo-400">30% to 35% premium</strong> during early placement.
                    </p>
                  </div>
                  <div className="bg-amber-50/50 dark:bg-amber-955/15 border border-amber-100 dark:border-amber-900/50 p-2.5 rounded-xl text-[10px] text-slate-600 dark:text-slate-350 leading-relaxed font-medium flex gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Action Plan:</strong> Complete these recommended programs during Class 11 and 12 vacations to assemble an unbeatable college portfolio.</span>
                  </div>
                </div>

              </div>

              {/* Programs Table */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-950 px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  <span>Suggested Programs, Certifications & Workshops</span>
                  <span className="text-indigo-700 dark:text-indigo-300">Curated bridging curriculum</span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {!selectedCareer.courseSuggestions || selectedCareer.courseSuggestions.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 font-medium text-[11px] italic">
                      All competencies align with your active profile. No gap curriculum required.
                    </div>
                  ) : (
                    selectedCareer.courseSuggestions.map((item, cidx) => (
                      <div key={cidx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-all">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                              item.type === 'Certification' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-150 dark:border-emerald-900' : 
                              item.type === 'Online Course' ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-150 dark:border-blue-900' : 
                              'bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-pink-300 border border-pink-150 dark:border-pink-900'
                            }`}>
                              {item.type}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{item.provider}</span>
                          </div>
                          <h5 className="text-xs font-bold text-slate-800 dark:text-white leading-snug">{item.courseTitle}</h5>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Bridges Gap in: <strong className="text-indigo-600 dark:text-indigo-400">{item.skillName}</strong></p>
                        </div>

                        <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center shrink-0 text-right gap-1">
                          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-2 py-0.5 rounded-md">
                            ⏳ {item.duration}
                          </span>
                          <a 
                            href={`https://www.google.com/search?q=${encodeURIComponent(item.provider + ' ' + item.courseTitle)}`}
                            target="_blank" 
                            rel="noreferrer"
                            className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline flex items-center gap-1 mt-0.5"
                          >
                            Explore Program ↗
                          </a>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Part C: Grounding references */}
      {report.groundingSources && report.groundingSources.length > 0 && (
        <div className="p-4 bg-emerald-50/20 dark:bg-emerald-950/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Globe className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
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
                className="inline-flex items-center gap-1 text-[10px] text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-900 transition-all font-bold shadow-sm cursor-pointer"
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
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 transition-colors duration-300">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
                  Standardized Student Counseling Dossier
                </h4>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Save PDF
                </button>
                <button
                  onClick={() => setShowDossierModal(false)}
                  className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Area */}
            <div id="printable-dossier-root" className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 bg-white dark:bg-slate-900 print:bg-white print:p-0 print:overflow-visible">
              
              {/* Report Header for print */}
              <div className="border-b-2 border-slate-900 dark:border-b-slate-700 pb-6 flex justify-between items-start gap-4">
                <div>
                  <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                    Stream Align Advisor
                  </h1>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider mt-1">
                    Standardized Academic counseling dossier & stream evaluation
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Evaluated under the standards of Class 10/11 Secondary Stream Mapping Regulations
                  </p>
                </div>
                
                {/* Official seal mock */}
                <div className="text-center shrink-0 p-3 border border-slate-800 dark:border-slate-750 rounded-xl bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white mb-1 shadow-md">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[8px] font-black tracking-widest text-slate-900 dark:text-white uppercase">OFFICIAL SEAL</span>
                  <span className="text-[7px] text-indigo-600 font-bold font-mono">STREAM ALIGN COGNITIVE CORE</span>
                </div>
              </div>

              {/* Dossier Metadata Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-550 block mb-0.5">Student Name</span>
                  <span className="font-extrabold text-slate-800 dark:text-white text-sm">{report.studentName}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-550 block mb-0.5">Assessment Date</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-100">{new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-550 block mb-0.5">Evaluation Core</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                    {report.isFallback ? "Offline Coprocessor" : "Gemini 3.5 Active"}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-550 block mb-0.5">Recommended Streams</span>
                  <span className="font-extrabold text-indigo-600">{report.recommendedStreams.length} Primary Paths</span>
                </div>
              </div>

              {/* Rationale overview */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest border-l-4 border-indigo-600 pl-2">
                  Academic Overview & General Advice
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                  {report.generalAdvice}
                </p>
              </div>

              {/* Recommended Streams mapped out */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest border-l-4 border-indigo-600 pl-2">
                  Recommended Class 11 & 12 Academic Streams
                </h3>
                <div className="space-y-4">
                  {report.recommendedStreams.map((stream, idx) => (
                    <div key={idx} className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 bg-white dark:bg-slate-950/40 shadow-sm break-inside-avoid">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-white">{stream.streamName}</h4>
                          <div className="flex gap-2 mt-1">
                            {stream.coreSubjects.map((sub, sidx) => (
                              <span key={sidx} className="text-[9px] font-semibold bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
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
                        <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                          <span className="font-bold text-indigo-955 dark:text-indigo-400 block mb-0.5">🎯 Hobby Alignment</span>
                          {stream.hobbyConnection}
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-955 rounded-xl border border-slate-200 dark:border-slate-800">
                          <span className="font-bold text-indigo-955 dark:text-indigo-400 block mb-0.5">🌐 Browsing Alignment Evidence</span>
                          {stream.browsingConnection}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Long Term Career paths */}
              <div className="space-y-4 break-inside-avoid">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest border-l-4 border-indigo-600 pl-2">
                  Futuristic Careers & Potential Professional Prospects
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {report.longTermCareers.map((career, idx) => (
                    <div key={idx} className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 space-y-2 text-xs flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="font-bold text-slate-800 dark:text-white leading-snug">{career.careerTitle}</h4>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1 font-medium">{career.description}</p>
                      </div>
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Market Valuation & Salary</span>
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{career.startingSalaryEstimate}</span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block pt-1">Required Core Skills</span>
                        <div className="flex flex-wrap gap-1">
                          {career.skillsRequired.slice(0, 3).map((s, sidx) => (
                            <span key={sidx} className="bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-[9px] font-bold px-1 rounded border border-slate-200 dark:border-slate-800">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legal & Educational Disclaimer */}
              <div className="border-t border-slate-200 dark:border-slate-850 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[10px] text-slate-400 break-inside-avoid">
                <div className="space-y-1">
                  <p className="font-bold">Stream Align Advisor Core Version 1.5</p>
                  <p>All assessments are powered by search-grounded contextual calculations and represent standard class alignment rules.</p>
                </div>
                <div className="shrink-0 text-right font-mono text-[9px] text-slate-500 dark:text-slate-450">
                  <p>Dossier Reference ID: NSCA-2026-F{Math.floor(Math.random() * 90000) + 10000}</p>
                  <p className="mt-0.5">Signature Authorized: STREAM ALIGN DIGITAL KEY</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
