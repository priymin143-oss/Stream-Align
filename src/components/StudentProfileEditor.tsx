import React, { useState } from "react";
import { WorkExperience, EducationQualification } from "../types";
import { GraduationCap, Briefcase, Wrench, Award, Plus, Trash2, Tag, BookOpen, AlertCircle } from "lucide-react";

interface StudentProfileEditorProps {
  marks: string;
  setMarks: (m: string) => void;
  technicalSkills: string[];
  setTechnicalSkills: React.Dispatch<React.SetStateAction<string[]>>;
  softSkills: string[];
  setSoftSkills: React.Dispatch<React.SetStateAction<string[]>>;
  workExperience: WorkExperience[];
  setWorkExperience: React.Dispatch<React.SetStateAction<WorkExperience[]>>;
  educationQualifications: EducationQualification[];
  setEducationQualifications: React.Dispatch<React.SetStateAction<EducationQualification[]>>;
}

export default function StudentProfileEditor({
  marks,
  setMarks,
  technicalSkills,
  setTechnicalSkills,
  softSkills,
  setSoftSkills,
  workExperience,
  setWorkExperience,
  educationQualifications,
  setEducationQualifications
}: StudentProfileEditorProps) {
  // Local input builders
  const [techInput, setTechInput] = useState("");
  const [softInput, setSoftInput] = useState("");

  // Work experience input builder
  const [newExpTitle, setNewExpTitle] = useState("");
  const [newExpCompany, setNewExpCompany] = useState("");
  const [newExpDuration, setNewExpDuration] = useState("");

  // Education input builder
  const [newEduDegree, setNewEduDegree] = useState("");
  const [newEduSchool, setNewEduSchool] = useState("");
  const [newEduDate, setNewEduDate] = useState("");

  // Suggested skills to quick-add
  const SUGGESTED_TECH = ["Python Programming", "Figma UI/UX Design", "MS Excel Modeling", "Basic Robotics", "HTML/CSS & Tailwind", "Video Editing", "Laboratory Pipetting", "Soil pH Assessment"];
  const SUGGESTED_SOFT = ["Problem Solving", "Creative Storytelling", "Persuasive Public Speaking", "Empathy & Caregiving", "Logical Deduction", "Systemic Troubleshooting", "Active Listening", "Collaborative Teamwork"];

  // Add handlers
  const handleAddTechSkill = (skill: string) => {
    const s = skill.trim();
    if (s && !technicalSkills.includes(s)) {
      setTechnicalSkills(prev => [...prev, s]);
    }
    setTechInput("");
  };

  const handleAddSoftSkill = (skill: string) => {
    const s = skill.trim();
    if (s && !softSkills.includes(s)) {
      setSoftSkills(prev => [...prev, s]);
    }
    setSoftInput("");
  };

  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpTitle.trim() || !newExpCompany.trim()) return;
    const newExp: WorkExperience = {
      jobTitle: newExpTitle.trim(),
      company: newExpCompany.trim(),
      duration: newExpDuration.trim() || "unspecified duration"
    };
    setWorkExperience(prev => [...prev, newExp]);
    setNewExpTitle("");
    setNewExpCompany("");
    setNewExpDuration("");
  };

  const handleAddEducation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEduDegree.trim() || !newEduSchool.trim()) return;
    const newEdu: EducationQualification = {
      degree: newEduDegree.trim(),
      institution: newEduSchool.trim(),
      graduationDate: newEduDate.trim() || "May 2025"
    };
    setEducationQualifications(prev => [...prev, newEdu]);
    setNewEduDegree("");
    setNewEduSchool("");
    setNewEduDate("");
  };

  // Quick preset grade clickers
  const applyMarksPreset = (preset: "excellent" | "balanced" | "humanities_leaning" | "commerce_leaning") => {
    if (preset === "excellent") {
      setMarks("Science: 98/100, Mathematics: 99/100, Computer Applications: 99/100, English: 95/100");
    } else if (preset === "balanced") {
      setMarks("Science: 84/100, Mathematics: 82/100, Social Studies: 88/100, English: 90/100");
    } else if (preset === "humanities_leaning") {
      setMarks("English Literature: 97/100, Social Studies/History: 95/100, Mathematics: 72/100, Art: Grade A+");
    } else if (preset === "commerce_leaning") {
      setMarks("Mathematics: 91/100, Social Studies: 86/100, English: 92/100, Commercial Studies Elective: 95/100");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <Award className="w-5 h-5 text-indigo-600" />
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Extended Academic & Professional Profile</h3>
          <p className="text-[11px] text-slate-500 font-medium">Add grades, skills, and projects to refine AI stream suggestions and compute skill gaps.</p>
        </div>
      </div>

      {/* Grid Layout for Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Academic Marks & Grades */}
        <div className="space-y-3">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            Class 10 Academic Grades & Marks
          </label>
          <textarea
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            rows={2}
            placeholder="e.g. Mathematics: 95/100, Science: 92/100, English: 88/100"
            className="w-full bg-slate-50 text-xs text-slate-800 rounded-xl p-3 border border-slate-200 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all font-medium placeholder-slate-400 resize-none"
          />
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[10px] text-slate-400 font-bold mr-1 self-center">Presets:</span>
            <button 
              type="button" 
              onClick={() => applyMarksPreset("excellent")}
              className="text-[9px] font-bold px-2 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg border border-indigo-100 transition-all"
            >
              Excellent Science
            </button>
            <button 
              type="button" 
              onClick={() => applyMarksPreset("balanced")}
              className="text-[9px] font-bold px-2 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg border border-slate-200 transition-all"
            >
              Balanced Average
            </button>
            <button 
              type="button" 
              onClick={() => applyMarksPreset("humanities_leaning")}
              className="text-[9px] font-bold px-2 py-1 bg-pink-50 text-pink-700 hover:bg-pink-100 rounded-lg border border-pink-100 transition-all"
            >
              Arts Leaning
            </button>
            <button 
              type="button" 
              onClick={() => applyMarksPreset("commerce_leaning")}
              className="text-[9px] font-bold px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg border border-amber-100 transition-all"
            >
              Commerce Leaning
            </button>
          </div>
        </div>

        {/* Educational Qualifications list & entry */}
        <div className="space-y-3">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
            Educational Qualifications / Diplomas
          </label>
          
          <div className="space-y-1.5 max-h-[105px] overflow-y-auto bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            {educationQualifications.length === 0 ? (
              <span className="text-[10px] text-slate-400 font-medium italic block p-1">No educational qualifications added yet</span>
            ) : (
              educationQualifications.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white px-2 py-1.5 rounded-lg border border-slate-100 text-[10px] shadow-2xs">
                  <div className="min-w-0">
                    <span className="font-bold text-slate-800 block truncate">{edu.degree}</span>
                    <span className="text-slate-500 block truncate">{edu.institution} ({edu.graduationDate})</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setEducationQualifications(prev => prev.filter((_, i) => i !== idx))}
                    className="p-1 hover:bg-rose-50 rounded text-rose-500 transition-all shrink-0 ml-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Quick Add row */}
          <form onSubmit={handleAddEducation} className="flex gap-1.5 items-center">
            <input 
              type="text" 
              placeholder="Degree (e.g. CBSE 10)" 
              value={newEduDegree} 
              onChange={e => setNewEduDegree(e.target.value)}
              className="w-1/3 bg-slate-50 text-[10px] rounded-lg p-2 border border-slate-200 focus:outline-none focus:bg-white font-medium placeholder-slate-400"
            />
            <input 
              type="text" 
              placeholder="Institution" 
              value={newEduSchool} 
              onChange={e => setNewEduSchool(e.target.value)}
              className="w-1/3 bg-slate-50 text-[10px] rounded-lg p-2 border border-slate-200 focus:outline-none focus:bg-white font-medium placeholder-slate-400"
            />
            <input 
              type="text" 
              placeholder="Grad Date" 
              value={newEduDate} 
              onChange={e => setNewEduDate(e.target.value)}
              className="w-1/4 bg-slate-50 text-[10px] rounded-lg p-2 border border-slate-200 focus:outline-none focus:bg-white font-medium placeholder-slate-400"
            />
            <button 
              type="submit" 
              className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all shrink-0"
              title="Add Education"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-5">
        
        {/* Technical Skills Portfolio */}
        <div className="space-y-3">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Wrench className="w-3.5 h-3.5 text-blue-500" />
            Technical Skills Portfolio
          </label>
          
          <div className="flex flex-wrap gap-1.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200 min-h-[75px] max-h-[120px] overflow-y-auto">
            {technicalSkills.length === 0 ? (
              <span className="text-[10px] text-slate-400 font-medium italic block p-1">No technical skills added yet</span>
            ) : (
              technicalSkills.map((skill) => (
                <span key={skill} className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 bg-blue-50 text-blue-800 rounded-lg border border-blue-100">
                  {skill}
                  <button 
                    type="button" 
                    onClick={() => setTechnicalSkills(prev => prev.filter(s => s !== skill))}
                    className="hover:text-rose-600 text-blue-400 font-normal ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>

          <div className="flex gap-1.5">
            <input 
              type="text" 
              placeholder="Add technical skill..." 
              value={techInput}
              onChange={e => setTechInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddTechSkill(techInput))}
              className="flex-1 bg-slate-50 text-[10px] rounded-lg p-2 border border-slate-200 focus:outline-none focus:bg-white font-medium placeholder-slate-400"
            />
            <button 
              type="button" 
              onClick={() => handleAddTechSkill(techInput)}
              className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Suggestions */}
          <div className="space-y-1">
            <span className="text-[9px] text-slate-400 font-bold block">Quick Add Tech Suggestions:</span>
            <div className="flex flex-wrap gap-1">
              {SUGGESTED_TECH.slice(0, 4).map(s => (
                <button
                  key={s}
                  type="button"
                  disabled={technicalSkills.includes(s)}
                  onClick={() => handleAddTechSkill(s)}
                  className="text-[9px] font-medium px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200/50 disabled:opacity-40 transition-all text-slate-600"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Soft Skills Portfolio */}
        <div className="space-y-3">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-amber-500" />
            Soft Skills Portfolio
          </label>
          
          <div className="flex flex-wrap gap-1.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200 min-h-[75px] max-h-[120px] overflow-y-auto">
            {softSkills.length === 0 ? (
              <span className="text-[10px] text-slate-400 font-medium italic block p-1">No soft skills added yet</span>
            ) : (
              softSkills.map((skill) => (
                <span key={skill} className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg border border-amber-100">
                  {skill}
                  <button 
                    type="button" 
                    onClick={() => setSoftSkills(prev => prev.filter(s => s !== skill))}
                    className="hover:text-rose-600 text-amber-400 font-normal ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>

          <div className="flex gap-1.5">
            <input 
              type="text" 
              placeholder="Add soft skill..." 
              value={softInput}
              onChange={e => setSoftInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddSoftSkill(softInput))}
              className="flex-1 bg-slate-50 text-[10px] rounded-lg p-2 border border-slate-200 focus:outline-none focus:bg-white font-medium placeholder-slate-400"
            />
            <button 
              type="button" 
              onClick={() => handleAddSoftSkill(softInput)}
              className="p-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-all shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Suggestions */}
          <div className="space-y-1">
            <span className="text-[9px] text-slate-400 font-bold block">Quick Add Soft Suggestions:</span>
            <div className="flex flex-wrap gap-1">
              {SUGGESTED_SOFT.slice(0, 4).map(s => (
                <button
                  key={s}
                  type="button"
                  disabled={softSkills.includes(s)}
                  onClick={() => handleAddSoftSkill(s)}
                  className="text-[9px] font-medium px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200/50 disabled:opacity-40 transition-all text-slate-600"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Part-time Experience / School Projects */}
      <div className="border-t border-slate-100 pt-5 space-y-3">
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
          Previous Work & Project Experiences (e.g. Science Clubs, Internships)
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* List display */}
          <div className="md:col-span-2 space-y-2 max-h-[140px] overflow-y-auto bg-slate-50 p-3 rounded-xl border border-slate-200">
            {workExperience.length === 0 ? (
              <span className="text-[10px] text-slate-400 font-medium italic block p-1">No project or work experience documented</span>
            ) : (
              workExperience.map((exp, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white px-3 py-2 rounded-xl border border-slate-100 text-[10px] shadow-2xs">
                  <div className="min-w-0">
                    <span className="font-bold text-slate-800 block truncate">{exp.jobTitle}</span>
                    <span className="text-slate-500 block truncate">{exp.company} • {exp.duration}</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setWorkExperience(prev => prev.filter((_, i) => i !== idx))}
                    className="p-1.5 hover:bg-rose-50 rounded text-rose-500 transition-all shrink-0 ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Quick add form */}
          <form onSubmit={handleAddExperience} className="bg-slate-50/50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between gap-2 text-[10px]">
            <div className="space-y-1.5">
              <input 
                type="text" 
                placeholder="Job Title or Project Role" 
                value={newExpTitle} 
                onChange={e => setNewExpTitle(e.target.value)}
                className="w-full bg-white text-[10px] rounded-lg p-2 border border-slate-200 focus:outline-none focus:border-indigo-500 font-medium placeholder-slate-400"
              />
              <input 
                type="text" 
                placeholder="Company / School Organ" 
                value={newExpCompany} 
                onChange={e => setNewExpCompany(e.target.value)}
                className="w-full bg-white text-[10px] rounded-lg p-2 border border-slate-200 focus:outline-none focus:border-indigo-500 font-medium placeholder-slate-400"
              />
              <input 
                type="text" 
                placeholder="Duration (e.g. 3 months, Summer 2025)" 
                value={newExpDuration} 
                onChange={e => setNewExpDuration(e.target.value)}
                className="w-full bg-white text-[10px] rounded-lg p-2 border border-slate-200 focus:outline-none focus:border-indigo-500 font-medium placeholder-slate-400"
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-1 shadow-sm mt-1"
            >
              <Plus className="w-3 h-3" />
              Document Experience
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
