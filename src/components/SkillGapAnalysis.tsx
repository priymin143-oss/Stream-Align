import React, { useState, useEffect } from "react";
import { CareerOption, StudentProfile } from "../types";
import { BrainCircuit, BookOpen, CheckCircle, AlertTriangle, Play, HelpCircle, GraduationCap, Award, Compass, Loader2, Sparkles, Code } from "lucide-react";

interface GapAnalysisResult {
  careerTitle: string;
  matchedSkills: string[];
  gapSkills: string[];
  courseSuggestions: {
    skillName: string;
    courseTitle: string;
    provider: string;
    type: "Online Course" | "Certification" | "Workshop";
    duration: string;
    link: string;
  }[];
  suggestedProject: {
    title: string;
    description: string;
    techStack: string[];
    difficulty: "Beginner" | "Intermediate" | "Advanced";
  };
  timelineEstimate: string;
  strategicAdvice: string;
  isFallback?: boolean;
}

interface SkillGapAnalysisProps {
  profile: StudentProfile;
  careers: CareerOption[];
  onAwardPoints: (points: number, description: string, badgeKey?: string) => void;
}

export default function SkillGapAnalysis({ profile, careers, onAwardPoints }: SkillGapAnalysisProps) {
  const [selectedCareer, setSelectedCareer] = useState<CareerOption | null>(careers[0] || null);
  const [analysis, setAnalysis] = useState<GapAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Synchronize selected career when careers list changes or is loaded
  useEffect(() => {
    if (careers.length > 0) {
      const exists = selectedCareer && careers.some(c => c.careerTitle === selectedCareer.careerTitle);
      if (!exists) {
        setSelectedCareer(careers[0]);
      }
    } else {
      setSelectedCareer(null);
    }
  }, [careers]);

  // Run initial analysis when selected career changes
  useEffect(() => {
    if (selectedCareer) {
      triggerAnalysis(selectedCareer);
    }
  }, [selectedCareer]);

  const triggerAnalysis = async (career: CareerOption) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/career/gap-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          careerTitle: career.careerTitle,
          skillsRequired: career.skillsRequired,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to retrieve gap analysis report.");
      }

      const data: GapAnalysisResult = await response.json();
      setAnalysis(data);

      // Award points for completing a skill gap analysis
      onAwardPoints(150, `Analyzed skill gaps for target career: ${career.careerTitle}`, "skill_builder");
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (careers.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 font-medium">
        Please generate a Counseling Report first by completing your student profile and clicking "Analyze Student Preset" to unlock AI Skill Gap Analysis.
      </div>
    );
  }

  return (
    <div id="skill-gap-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Career Selector */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="space-y-1">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <BrainCircuit className="w-4 h-4 text-indigo-600" />
            Select Career Goal
          </h3>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            Choose one of your recommended career options to run a targeted AI gap audit against your active profile.
          </p>
        </div>

        <div className="space-y-2">
          {careers.map((career) => {
            const isSelected = selectedCareer?.careerTitle === career.careerTitle;
            return (
              <button
                key={career.careerTitle}
                onClick={() => setSelectedCareer(career)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex flex-col gap-1 ${
                  isSelected
                    ? "bg-indigo-50 border-indigo-300 shadow-sm"
                    : "bg-white hover:bg-slate-50 border-slate-200"
                }`}
              >
                <span className={`font-extrabold tracking-tight ${isSelected ? "text-indigo-900" : "text-slate-800"}`}>
                  {career.careerTitle}
                </span>
                <span className="text-[10px] text-slate-500 leading-normal line-clamp-2">
                  {career.description}
                </span>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {career.skillsRequired.slice(0, 3).map((s) => (
                    <span key={s} className="bg-slate-100/80 border border-slate-200/60 rounded-full px-2 py-0.5 text-[9px] font-mono text-slate-600 font-semibold">
                      {s}
                    </span>
                  ))}
                  {career.skillsRequired.length > 3 && (
                    <span className="text-[9px] text-slate-400 font-bold font-mono self-center">
                      +{career.skillsRequired.length - 3} more
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Column: AI Analysis Output */}
      <div className="lg:col-span-8 space-y-6">
        {loading && (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center space-y-4 flex flex-col items-center justify-center shadow-sm min-h-[400px]">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">AI Coprocessor Gap Audit Active</h4>
              <p className="text-xs text-slate-500 font-medium max-w-sm">
                Evaluating {profile.name}'s active skills vs. {selectedCareer?.careerTitle}'s core specifications...
              </p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3">
            <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-xs text-rose-800 font-bold">{error}</p>
            <button
              onClick={() => selectedCareer && triggerAnalysis(selectedCareer)}
              className="bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-xl"
            >
              Retry Gap Audit
            </button>
          </div>
        )}

        {analysis && !loading && (
          <div className="space-y-6">
            {/* Header Insight */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">
                      AI Competency & Gap Audit
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Personalized evaluation for <strong>{profile.name}</strong>
                    </p>
                  </div>
                </div>
                {analysis.isFallback && (
                  <span className="text-[9px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full">
                    ⚡ Local Coprocessor Active
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                <span className="font-extrabold text-indigo-900 block mb-1">💡 Strategic Advisor Advice:</span>
                {analysis.strategicAdvice}
              </div>

              {/* Progress Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-emerald-50/50 border border-emerald-100/60 p-3 rounded-xl flex items-start gap-2.5">
                  <div className="w-7 h-7 bg-emerald-100 border border-emerald-200 rounded-lg flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800">Matched Competencies</span>
                    <p className="text-xs text-emerald-900 font-extrabold font-mono">
                      {analysis.matchedSkills.length} / {selectedCareer?.skillsRequired.length} Skills
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50/50 border border-amber-100/60 p-3 rounded-xl flex items-start gap-2.5">
                  <div className="w-7 h-7 bg-amber-100 border border-amber-200 rounded-lg flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-black tracking-wider text-amber-800">Identified Gaps</span>
                    <p className="text-xs text-amber-900 font-extrabold font-mono">
                      {analysis.gapSkills.length} Core Skill Gaps
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Competency Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Matched Skills Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Skills You Possess ({analysis.matchedSkills.length})
                </h4>
                {analysis.matchedSkills.length === 0 ? (
                  <p className="text-[11px] text-slate-400 font-medium italic">
                    No matching direct skills detected. Let's build them up!
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {analysis.matchedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-xl px-3 py-1.5 text-[11px] font-bold tracking-tight flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Gap Skills Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Identified Skill Gaps ({analysis.gapSkills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.gapSkills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-amber-50 text-amber-800 border border-amber-200/80 rounded-xl px-3 py-1.5 text-[11px] font-bold tracking-tight flex items-center gap-1"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended Learning Resources */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="space-y-1 border-b border-slate-100 pb-2.5">
                <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-4.5 h-4.5 text-indigo-600" />
                  Recommended Online Courses & Certifications
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  High-fidelity academic pathways sourced dynamically to bridge your exact gap categories.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.courseSuggestions.map((course, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 flex flex-col justify-between hover:border-indigo-200 transition-all">
                    <div className="space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 font-mono font-bold text-[9px] px-2 py-0.5 rounded-full">
                          {course.type}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold font-mono shrink-0">
                          {course.duration}
                        </span>
                      </div>
                      <h5 className="text-xs font-black text-slate-800 leading-snug">
                        {course.courseTitle}
                      </h5>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 mt-1">
                      <span className="text-[10px] text-slate-500 font-bold font-sans">
                        Via {course.provider}
                      </span>
                      <a
                        href={course.link || "https://www.coursera.org"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 transition-colors"
                      >
                        Enroll <Play className="w-2.5 h-2.5 fill-current" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Capstone Project */}
            {analysis.suggestedProject && (
              <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-md space-y-4 border border-slate-800 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/20 rounded-full px-2 py-0.5 text-[9px] font-mono font-bold uppercase">
                        Mastery Capstone Project
                      </span>
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/20 rounded-full px-2 py-0.5 text-[9px] font-mono font-bold uppercase">
                        {analysis.suggestedProject.difficulty}
                      </span>
                    </div>
                    <h4 className="text-sm font-black tracking-tight text-white flex items-center gap-1.5 mt-1.5">
                      <Code className="w-4 h-4 text-indigo-400" />
                      {analysis.suggestedProject.title}
                    </h4>
                  </div>
                  <div className="bg-indigo-600 text-white rounded-xl px-2.5 py-1 text-[10px] font-bold shrink-0 shadow-sm font-mono">
                    ⏰ {analysis.timelineEstimate}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {analysis.suggestedProject.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider">Suggested Tech Stack</span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.suggestedProject.techStack.map((tech) => (
                      <span key={tech} className="bg-slate-800 border border-slate-700 text-slate-300 font-mono font-bold text-[10px] px-2.5 py-1 rounded-lg">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
