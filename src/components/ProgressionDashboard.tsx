import React from "react";
import { CareerOption, CareerMilestone } from "../types";
import { CheckCircle2, Circle, Trophy, Star, GraduationCap, MapPin, Briefcase, Award } from "lucide-react";

interface ProgressionDashboardProps {
  career: CareerOption;
  completedMilestoneKeys: string[];
  onToggleMilestone: (milestoneTitle: string) => void;
}

export default function ProgressionDashboard({
  career,
  completedMilestoneKeys,
  onToggleMilestone,
}: ProgressionDashboardProps) {
  const milestones = career.milestones || [];
  const completedCount = milestones.filter(m => completedMilestoneKeys.includes(m.title)).length;
  const totalCount = milestones.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

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
      case 0: return "border-blue-100 bg-blue-50/20";
      case 1: return "border-violet-100 bg-violet-50/20";
      case 2: return "border-indigo-100 bg-indigo-50/20";
      case 3: return "border-emerald-100 bg-emerald-50/20";
      default: return "border-amber-100 bg-amber-50/20";
    }
  };

  return (
    <div id="progression-dashboard-card" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
      
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

        {/* Dynamic Progress Indicator */}
        <div className="w-full md:w-64 bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-4 shadow-inner">
          <div className="relative flex items-center justify-center w-12 h-12">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                className="text-slate-200"
                strokeWidth="4"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                className="text-indigo-600 transition-all duration-500"
                strokeWidth="4"
                strokeDasharray={2 * Math.PI * 20}
                strokeDashoffset={2 * Math.PI * 20 * (1 - progressPercentage / 100)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-xs font-mono font-bold text-slate-800">
              {progressPercentage}%
            </span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-700 block">Milestones Cleared</span>
            <span className="text-[10px] text-slate-400 font-medium">{completedCount} of {totalCount} goals achieved</span>
          </div>
        </div>
      </div>

      {/* Description of Career context */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-200 text-xs">
        <div>
          <h4 className="font-bold text-slate-700 mb-1">Career Goal: {career.careerTitle}</h4>
          <p className="text-slate-500 font-medium leading-relaxed">{career.description}</p>
        </div>
        <div>
          <h4 className="font-bold text-slate-700 mb-1">Target Capabilities</h4>
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
      <div className="relative pl-6 space-y-6 before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {milestones.map((milestone: CareerMilestone, idx) => {
          const isCompleted = completedMilestoneKeys.includes(milestone.title);
          return (
            <div
              key={idx}
              className={`relative flex gap-4 p-4 rounded-xl border transition-all ${getMilestoneColor(idx)} ${
                isCompleted ? "ring-1 ring-emerald-500/20 border-emerald-500/20 bg-emerald-50/10" : ""
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute -left-[27px] top-6 bg-white border-2 border-slate-200 rounded-full p-0.5 transition-all">
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 bg-white rounded-full" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300 bg-white rounded-full" />
                )}
              </div>

              {/* Step indicator Icon */}
              <div className="p-2 bg-white rounded-lg h-fit border border-slate-200 shadow-sm">
                {getMilestoneIcon(idx)}
              </div>

              {/* Text context */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap justify-between items-start gap-1">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">
                      Stage {idx + 1}: {milestone.stage || "Preparatory Stage"}
                    </span>
                    <h4 className="text-sm font-bold text-slate-800 mt-0.5">
                      {milestone.title}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-white px-2.5 py-1 rounded border border-slate-200 text-slate-600 shadow-sm">
                    {milestone.timeline}
                  </span>
                </div>

                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {milestone.description}
                </p>

                {/* Skills checklist inside milestone */}
                {milestone.skillsToAcquire && milestone.skillsToAcquire.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">Skills to Target:</span>
                    <div className="flex flex-wrap gap-1">
                      {milestone.skillsToAcquire.map((skill, sidx) => (
                        <span key={sidx} className="bg-white text-[10px] text-slate-500 font-semibold px-2 py-0.5 rounded border border-slate-200">
                          ✓ {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Milestone Toggle check action */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => onToggleMilestone(milestone.title)}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded transition-all flex items-center gap-1 shadow-sm ${
                      isCompleted
                        ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/80"
                        : "bg-slate-100 text-slate-600 hover:text-slate-800 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    {isCompleted ? "Completed ✓" : "Mark Achieved"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
