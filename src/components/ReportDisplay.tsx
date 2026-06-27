import React from "react";
import { AnalysisReport, StreamRecommendation, CareerOption } from "../types";
import { Award, Compass, Globe, Sparkles, BookOpen, ChevronRight, TrendingUp, DollarSign } from "lucide-react";

interface ReportDisplayProps {
  report: AnalysisReport;
  onSelectCareer: (career: CareerOption) => void;
  selectedCareerTitle?: string;
}

export default function ReportDisplay({
  report,
  onSelectCareer,
  selectedCareerTitle,
}: ReportDisplayProps) {
  // Color badges for streams
  const getStreamBadgeStyle = (percentage: number) => {
    if (percentage >= 85) return "from-indigo-600/20 to-violet-600/20 text-indigo-300 border-indigo-500/30";
    if (percentage >= 70) return "from-emerald-600/20 to-teal-600/20 text-emerald-300 border-emerald-500/30";
    return "from-sky-600/20 to-blue-600/20 text-sky-300 border-sky-500/30";
  };

  return (
    <div id="report-display-container" className="space-y-8">
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
        
        <div className="flex items-center gap-2 mb-3">
          <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 font-bold">Personalized Counseling Report</span>
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
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <h4 className="text-base font-bold text-slate-800 tracking-tight">
                    {stream.streamName}
                  </h4>
                  <span className="text-xs font-mono font-bold bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 text-slate-600">
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
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
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
    </div>
  );
}
