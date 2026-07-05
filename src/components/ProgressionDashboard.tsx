import React, { useState, useEffect } from "react";
import { CareerOption, CareerMilestone } from "../types";
import { CheckCircle2, Circle, Trophy, Star, GraduationCap, MapPin, Briefcase, Award, ArrowRight, Settings, FileText, Check, Plus, Trash } from "lucide-react";

interface ProgressionDashboardProps {
  career: CareerOption;
  completedMilestoneKeys: string[];
  onToggleMilestone: (milestoneTitle: string) => void;
  allCareers?: CareerOption[];
  onSelectCareer?: (career: CareerOption) => void;
}

export default function ProgressionDashboard({
  career,
  completedMilestoneKeys,
  onToggleMilestone,
  allCareers = [],
  onSelectCareer,
}: ProgressionDashboardProps) {
  const milestones = career.milestones || [];
  const completedCount = milestones.filter(m => completedMilestoneKeys.includes(m.title)).length;
  const totalCount = milestones.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Local storage persisted skill checkoff state
  const [completedSkills, setCompletedSkills] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`skills-${career.careerTitle}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Local storage persisted custom notes state per milestone
  const [milestoneNotes, setMilestoneNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(`notes-${career.careerTitle}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Write state back to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(`skills-${career.careerTitle}`, JSON.stringify(completedSkills));
  }, [completedSkills, career.careerTitle]);

  useEffect(() => {
    localStorage.setItem(`notes-${career.careerTitle}`, JSON.stringify(milestoneNotes));
  }, [milestoneNotes, career.careerTitle]);

  // Handle skill toggle
  const handleToggleSkill = (skill: string) => {
    setCompletedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  // Handle note change
  const handleNoteChange = (title: string, text: string) => {
    setMilestoneNotes((prev) => ({
      ...prev,
      [title]: text,
    }));
  };

  // Select all individual skills across the milestones
  const allMilestoneSkills = React.useMemo(() => {
    const list: string[] = [];
    milestones.forEach((m) => {
      if (m.skillsToAcquire) {
        m.skillsToAcquire.forEach((s) => {
          if (!list.includes(s)) list.push(s);
        });
      }
    });
    return list;
  }, [milestones]);

  const skillCompletedCount = allMilestoneSkills.filter((s) => completedSkills.includes(s)).length;
  const skillProgressPercentage = allMilestoneSkills.length > 0 
    ? Math.round((skillCompletedCount / allMilestoneSkills.length) * 100) 
    : 0;

  // Icon selector based on stage
  const getMilestoneIcon = (index: number) => {
    switch (index) {
      case 0: return <GraduationCap className="w-5 h-5 text-blue-600" />;
      case 1: return <Star className="w-5 h-5 text-violet-600" />;
      case 2: return <Award className="w-5 h-5 text-indigo-600" />;
      case 3: return <Briefcase className="w-5 h-5 text-emerald-600" />;
      default: return <Trophy className="w-5 h-5 text-amber-600" />;
    }
  };

  const getMilestoneColor = (index: number) => {
    switch (index) {
      case 0: return "border-blue-100 bg-blue-50/10";
      case 1: return "border-violet-100 bg-violet-50/10";
      case 2: return "border-indigo-100 bg-indigo-50/10";
      case 3: return "border-emerald-100 bg-emerald-50/10";
      default: return "border-amber-100 bg-amber-50/10";
    }
  };

  return (
    <div id="progression-dashboard-card" className="space-y-6">
      
      {/* Career switcher tabs if multiple options exist */}
      {allCareers.length > 0 && onSelectCareer && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest block">
            Select Pathway to Track:
          </span>
          <div className="flex flex-wrap gap-2">
            {allCareers.map((c, idx) => {
              const isSel = c.careerTitle === career.careerTitle;
              return (
                <button
                  key={idx}
                  onClick={() => onSelectCareer(c)}
                  className={`text-xs font-extrabold px-3.5 py-2 rounded-xl border transition-all flex items-center gap-1.5 shadow-sm ${
                    isSel
                      ? "bg-indigo-600 text-white border-indigo-500"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  <Trophy className={`w-3.5 h-3.5 ${isSel ? "text-amber-300" : "text-slate-400"}`} />
                  {c.careerTitle}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
        
        {/* Tracker Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Trophy className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h3 className="text-lg font-bold text-slate-800">Progression Tracker & Milestones</h3>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Interactive roadmap for <span className="text-indigo-600 font-bold">{career.careerTitle}</span>
            </p>
          </div>

          {/* Dual Progress Indicators */}
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Stage completion progress */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-3 shadow-inner shrink-0">
              <div className="relative flex items-center justify-center w-10 h-10">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="20" cy="20" r="16" className="text-slate-200" strokeWidth="3.5" stroke="currentColor" fill="transparent" />
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    className="text-indigo-600 transition-all duration-500"
                    strokeWidth="3.5"
                    strokeDasharray={2 * Math.PI * 16}
                    strokeDashoffset={2 * Math.PI * 16 * (1 - progressPercentage / 100)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-[9px] font-mono font-black text-slate-800">{progressPercentage}%</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-700 block uppercase tracking-wider">Stages Completed</span>
                <span className="text-[9px] text-slate-500 font-medium">{completedCount} of {totalCount} cleared</span>
              </div>
            </div>

            {/* Micro-skills completion progress */}
            {allMilestoneSkills.length > 0 && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-3 shadow-inner shrink-0">
                <div className="relative flex items-center justify-center w-10 h-10">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="20" cy="20" r="16" className="text-slate-200" strokeWidth="3.5" stroke="currentColor" fill="transparent" />
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      className="text-emerald-600 transition-all duration-500"
                      strokeWidth="3.5"
                      strokeDasharray={2 * Math.PI * 16}
                      strokeDashoffset={2 * Math.PI * 16 * (1 - skillProgressPercentage / 100)}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                    />
                  </svg>
                  <span className="absolute text-[9px] font-mono font-black text-slate-800">{skillProgressPercentage}%</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-700 block uppercase tracking-wider">Skills Acquired</span>
                  <span className="text-[9px] text-slate-500 font-medium">{skillCompletedCount} of {allMilestoneSkills.length} mastered</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Horizontal Subway-Line Map Progress Step Indicator (Feature 3 Visual) */}
        <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-indigo-600" />
            Long-term Career Pathway Map
          </h4>
          <div className="relative flex justify-between items-center max-w-3xl mx-auto py-5 px-2">
            {/* Background connecting track */}
            <div className="absolute left-6 right-6 top-1/2 h-1 bg-slate-200 -translate-y-1/2 rounded-full" />
            
            {/* Active highlighted track */}
            <div 
              className="absolute left-6 top-1/2 h-1 bg-indigo-600 -translate-y-1/2 rounded-full transition-all duration-500" 
              style={{ width: `${Math.max(0, ((completedCount - 1) / Math.max(1, totalCount - 1)) * 100)}%` }}
            />

            {milestones.map((m, idx) => {
              const isMilestoneCompleted = completedMilestoneKeys.includes(m.title);
              const isCurrentActive = idx === completedCount || (idx === totalCount - 1 && completedCount === totalCount);
              return (
                <button
                  key={idx}
                  onClick={() => {
                    const el = document.getElementById(`milestone-card-${idx}`);
                    el?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className="relative z-10 flex flex-col items-center group focus:outline-none focus:ring-0"
                >
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isMilestoneCompleted 
                        ? "bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-600/15" 
                        : isCurrentActive 
                          ? "bg-indigo-600 border-indigo-500 text-white ring-4 ring-indigo-500/10 shadow-md" 
                          : "bg-white border-slate-300 text-slate-500 hover:border-slate-400"
                    }`}
                  >
                    {isMilestoneCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-black">{idx + 1}</span>
                    )}
                  </div>
                  <span className="absolute top-11 text-[9px] font-bold text-slate-500 text-center uppercase tracking-wider hidden md:block w-24 truncate" title={m.stage}>
                    {m.stage}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Target Capabilities & Skill Development Matrix */}
        {allMilestoneSkills.length > 0 && (
          <div className="p-5 rounded-2xl border border-indigo-100 bg-indigo-50/20 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                <Star className="w-4 h-4 text-indigo-600 animate-pulse" />
                Target Capabilities Checklist & Skill Acquisition Board
              </h4>
              <span className="text-[10px] font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded border border-indigo-200 uppercase font-black tracking-wider">
                Interactive tracker
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Check off individual scientific or technical capabilities as you master them through Class 11/12, undergrad projects, or online coursework:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {allMilestoneSkills.map((skill, sidx) => {
                const isAcquired = completedSkills.includes(skill);
                return (
                  <button
                    key={sidx}
                    onClick={() => handleToggleSkill(skill)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-2 shadow-sm ${
                      isAcquired
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-300/10"
                        : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${isAcquired ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300"}`}>
                      {isAcquired && <Check className="w-2.5 h-2.5" />}
                    </div>
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Description of Career context */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-200 text-xs">
          <div>
            <h4 className="font-bold text-slate-700 mb-1">Career Goal: {career.careerTitle}</h4>
            <p className="text-slate-500 font-medium leading-relaxed">{career.description}</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-700 mb-1">Standard Required Profile Capabilities</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {career.skillsRequired.map((skill, sidx) => (
                <span key={sidx} className="bg-white text-slate-600 border border-slate-200/80 px-2.5 py-1 rounded text-[10px] font-bold shadow-sm">
                  ⚡ {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Vertical Interactive Timeline */}
        <div className="relative pl-6 space-y-8 before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {milestones.map((milestone: CareerMilestone, idx) => {
            const isCompleted = completedMilestoneKeys.includes(milestone.title);
            const activeNote = milestoneNotes[milestone.title] || "";

            return (
              <div
                key={idx}
                id={`milestone-card-${idx}`}
                className={`relative flex flex-col md:flex-row gap-4 p-5 rounded-2xl border transition-all ${getMilestoneColor(idx)} ${
                  isCompleted ? "ring-1 ring-emerald-500/20 border-emerald-500/20 bg-emerald-50/10" : ""
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute -left-[27px] top-6 bg-white border-2 border-slate-200 rounded-full p-0.5 transition-all">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 bg-white rounded-full shadow-sm" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300 bg-white rounded-full" />
                  )}
                </div>

                {/* Left block: step icon & key description */}
                <div className="flex gap-4 items-start flex-1">
                  {/* Step indicator Icon */}
                  <div className="p-2.5 bg-white rounded-xl h-fit border border-slate-200 shadow-sm shrink-0">
                    {getMilestoneIcon(idx)}
                  </div>

                  {/* Text context */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap justify-between items-start gap-1">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block">
                          Stage {idx + 1}: {milestone.stage || "Preparatory Stage"}
                        </span>
                        <h4 className="text-base font-extrabold text-slate-800 mt-0.5">
                          {milestone.title}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-white px-2.5 py-1 rounded-md border border-slate-200 text-slate-600 shadow-sm">
                        {milestone.timeline}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {milestone.description}
                    </p>

                    {/* Skills checklist inside milestone */}
                    {milestone.skillsToAcquire && milestone.skillsToAcquire.length > 0 && (
                      <div className="pt-2.5 border-t border-slate-100">
                        <span className="text-[10px] text-slate-400 font-extrabold block mb-1.5 uppercase tracking-wider">Skills to Acquire:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {milestone.skillsToAcquire.map((skill, sidx) => {
                            const isSkillMastered = completedSkills.includes(skill);
                            return (
                              <button
                                key={sidx}
                                onClick={() => handleToggleSkill(skill)}
                                className={`text-[9px] font-bold px-2 py-1 rounded transition-all flex items-center gap-1 border ${
                                  isSkillMastered
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                                }`}
                              >
                                <span>{isSkillMastered ? "✓" : "○"}</span>
                                <span>{skill}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Milestone Toggle check action */}
                    <div className="pt-2.5 flex justify-between items-center border-t border-slate-100">
                      <span className="text-[9px] text-slate-400 italic font-medium">Clear this stage to advance on the map</span>
                      <button
                        onClick={() => onToggleMilestone(milestone.title)}
                        className={`text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm ${
                          isCompleted
                            ? "bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300"
                            : "bg-indigo-600 text-white hover:bg-indigo-500 border border-indigo-600"
                        }`}
                      >
                        {isCompleted ? "Completed ✓" : "Mark Achieved"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right block: Custom notepad journal for this milestone (Feature 3) */}
                <div className="md:w-60 shrink-0 flex flex-col space-y-1.5 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 md:self-stretch justify-between">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      Aspirations Journal
                    </label>
                    <textarea
                      value={activeNote}
                      onChange={(e) => handleNoteChange(milestone.title, e.target.value)}
                      placeholder="Type custom targets here (e.g. Target GPA, preferred colleges, exam schedules)..."
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-[11px] text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 resize-none h-24 md:h-32 transition-all font-medium"
                    />
                  </div>
                  <span className="text-[9px] text-slate-400 text-right block font-mono">Changes save locally automatically</span>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
