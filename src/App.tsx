import React, { useState, useEffect } from "react";
import { StudentProfile, AnalysisReport, BrowsingLog, CareerOption, WorkExperience, EducationQualification } from "./types";
import { PRESET_PERSONAS, StudentPersona } from "./data/mockData";
import BrowsingHistorySimulator from "./components/BrowsingHistorySimulator";
import HobbyInterestInput from "./components/HobbyInterestInput";
import StudentProfileEditor from "./components/StudentProfileEditor";
import ReportDisplay from "./components/ReportDisplay";
import ProgressionDashboard from "./components/ProgressionDashboard";
import CareerAdvisorChatbot from "./components/CareerAdvisorChatbot";
import { Compass, Sparkles, BookOpen, BrainCircuit, UserCheck, ArrowRight, Loader2, RefreshCw, Star } from "lucide-react";

export default function App() {
  // Input states
  const [studentName, setStudentName] = useState("Aarav Sharma");
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(PRESET_PERSONAS[0].hobbies);
  const [browsingLogs, setBrowsingLogs] = useState<BrowsingLog[]>(PRESET_PERSONAS[0].logs);
  
  // Expanded profile states
  const [marks, setMarks] = useState<string>(PRESET_PERSONAS[0].marks || "");
  const [technicalSkills, setTechnicalSkills] = useState<string[]>(PRESET_PERSONAS[0].technicalSkills || []);
  const [softSkills, setSoftSkills] = useState<string[]>(PRESET_PERSONAS[0].softSkills || []);
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>(PRESET_PERSONAS[0].workExperience || []);
  const [educationQualifications, setEducationQualifications] = useState<EducationQualification[]>(PRESET_PERSONAS[0].educationQualifications || []);

  // App system states
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [selectedCareer, setSelectedCareer] = useState<CareerOption | null>(null);
  const [completedMilestonesByCareer, setCompletedMilestonesByCareer] = useState<Record<string, string[]>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Instant simulated calculations
  const simulatedAffinity = React.useMemo(() => {
    let pcm = 45;
    let pcb = 40;
    let commerce = 40;
    let humanities = 40;

    // Weight hobbies
    selectedHobbies.forEach((hobby) => {
      const h = hobby.toLowerCase();
      if (h.includes("code") || h.includes("robot") || h.includes("game") || h.includes("math") || h.includes("tech") || h.includes("program")) pcm += 15;
      if (h.includes("bio") || h.includes("garden") || h.includes("chem") || h.includes("nature") || h.includes("health") || h.includes("doctor")) pcb += 15;
      if (h.includes("trade") || h.includes("finance") || h.includes("business") || h.includes("money") || h.includes("invest") || h.includes("entrepreneur")) commerce += 15;
      if (h.includes("read") || h.includes("psych") || h.includes("art") || h.includes("paint") || h.includes("social") || h.includes("writ") || h.includes("history")) humanities += 15;
    });

    // Weight browsing history logs
    browsingLogs.forEach((log) => {
      const cat = log.category.toLowerCase();
      const title = log.title.toLowerCase();
      
      if (cat.includes("tech") || cat.includes("computer") || title.includes("code") || title.includes("math") || title.includes("programming")) pcm += 8;
      if (cat.includes("science") || cat.includes("biology") || title.includes("bio") || title.includes("gene") || title.includes("earth") || title.includes("chemistry")) pcb += 8;
      if (cat.includes("business") || cat.includes("finance") || cat.includes("economics") || title.includes("market") || title.includes("startup") || title.includes("stock")) commerce += 8;
      if (cat.includes("arts") || cat.includes("humanities") || cat.includes("social") || title.includes("history") || title.includes("mind") || title.includes("design") || title.includes("literature")) humanities += 8;
    });

    // Cap at 99
    return {
      pcm: Math.min(pcm, 99),
      pcb: Math.min(pcb, 99),
      commerce: Math.min(commerce, 99),
      humanities: Math.min(humanities, 99),
    };
  }, [selectedHobbies, browsingLogs]);
  
  // Mode selection
  const [activeTab, setActiveTab] = useState<"counselor" | "milestones">("counselor");

  // Load preset persona helper
  const handleSelectPersona = (persona: StudentPersona) => {
    setStudentName(persona.name);
    setSelectedHobbies(persona.hobbies);
    setBrowsingLogs(persona.logs);
    setMarks(persona.marks || "");
    setTechnicalSkills(persona.technicalSkills || []);
    setSoftSkills(persona.softSkills || []);
    setWorkExperience(persona.workExperience || []);
    setEducationQualifications(persona.educationQualifications || []);
    // Clear old state
    setReport(null);
    setSelectedCareer(null);
    setErrorMessage(null);
  };

  // Custom log management
  const handleAddLog = (newLog: Omit<BrowsingLog, "id" | "timestamp">) => {
    const log: BrowsingLog = {
      ...newLog,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setBrowsingLogs((prev) => [log, ...prev]);
    setErrorMessage(null);
  };

  const handleRemoveLog = (id: string) => {
    setBrowsingLogs((prev) => prev.filter((log) => log.id !== id));
    setErrorMessage(null);
  };

  const handleResetLogs = () => {
    setBrowsingLogs([]);
    setErrorMessage(null);
  };

  // Custom hobbies management
  const handleAddHobby = (hobby: string) => {
    if (!selectedHobbies.includes(hobby)) {
      setSelectedHobbies((prev) => [...prev, hobby]);
      setErrorMessage(null);
    }
  };

  const handleRemoveHobby = (hobby: string) => {
    setSelectedHobbies((prev) => prev.filter((h) => h !== hobby));
    setErrorMessage(null);
  };

  // Trigger Backend Counselor API Analysis
  const handleRunAnalysis = async () => {
    if (!studentName.trim()) return;
    setIsLoading(true);
    setReport(null);
    setSelectedCareer(null);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/career/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName,
          hobbies: selectedHobbies,
          browsingLogs,
          marks,
          technicalSkills,
          softSkills,
          workExperience,
          educationQualifications
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to evaluate career pathways from Gemini AI.");
      }

      const data: AnalysisReport = await response.json();
      setReport(data);
      
      // Auto-select first career
      if (data.longTermCareers && data.longTermCareers.length > 0) {
        setSelectedCareer(data.longTermCareers[0]);
      }
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "Analysis server returned an error. Please verify your internet connection or API keys.");
    } finally {
      setIsLoading(false);
    }
  };

  // Milestone checkoff helper
  const handleToggleMilestone = (milestoneTitle: string) => {
    if (!selectedCareer) return;
    const careerKey = selectedCareer.careerTitle;
    setCompletedMilestonesByCareer((prev) => {
      const currentList = prev[careerKey] || [];
      const updatedList = currentList.includes(milestoneTitle)
        ? currentList.filter((m) => m !== milestoneTitle)
        : [...currentList, milestoneTitle];
      return {
        ...prev,
        [careerKey]: updatedList
      };
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-600 selection:text-white relative">
      {/* Dynamic ambient header glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white/95 sticky top-0 z-50 backdrop-blur shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center shadow-md shadow-indigo-500/10">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight flex flex-wrap items-center gap-2 font-sans">
                Careerly AI
                <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded-full">
                  Stream & Career Portal
                </span>
                {report ? (
                  report.isFallback ? (
                    <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                      Local Coprocessor
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                      Gemini 3.5 Active
                    </span>
                  )
                ) : null}
              </h1>
              <p className="text-xs text-slate-500 font-medium">Standardized Class 11-12 stream mapping & futuristic career progression tracker</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab("counselor")}
              className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${
                activeTab === "counselor"
                  ? "bg-white text-indigo-700 border border-slate-200 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Counselor Report & Chat
            </button>
            <button
              onClick={() => setActiveTab("milestones")}
              disabled={!selectedCareer}
              className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${
                !selectedCareer ? "opacity-50 cursor-not-allowed" : ""
              } ${
                activeTab === "milestones"
                  ? "bg-white text-indigo-700 border border-slate-200 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Progression Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 space-y-8 z-10">
        
        {/* Section 1: Dynamic Persona & Input Sandbox */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              1. Setup Student Background Sandbox
            </h2>
            <span className="text-xs text-slate-500 font-medium italic">Select a preset to test immediate combinations</span>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {PRESET_PERSONAS.map((persona) => {
              const isSelected = studentName === persona.name;
              return (
                <button
                  key={persona.name}
                  onClick={() => handleSelectPersona(persona)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 relative overflow-hidden shadow-sm ${
                    isSelected
                      ? "bg-indigo-50/80 border-indigo-500 ring-1 ring-indigo-500/30 text-indigo-950"
                      : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <span className="text-2xl shrink-0">{persona.avatar}</span>
                  <div className="min-w-0">
                    <span className={`text-xs font-bold block truncate ${isSelected ? "text-indigo-950" : "text-slate-800"}`}>{persona.name}</span>
                    <span className="text-[10px] text-slate-500 block truncate">{persona.description}</span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-1 right-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Name modification bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full md:w-1/3">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Student Full Name</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Priyanshu Singh"
                className="w-full bg-slate-50 text-xs text-slate-800 rounded-xl p-3 border border-slate-200 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all font-medium"
              />
            </div>
            <div className="w-full md:w-2/3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-500 leading-relaxed font-medium">
                Provide custom campus WiFi searches & hobbies on the cards below. Once prepared, evaluate the profile using our AI core.
              </div>
              <button
                onClick={handleRunAnalysis}
                disabled={isLoading || !studentName.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-indigo-600/10 shrink-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Evaluating...
                  </>
                ) : (
                  <>
                    Run AI Career Path Evaluation
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Grid of Browsing Logs & Hobby entries */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HobbyInterestInput
              selectedHobbies={selectedHobbies}
              onAddHobby={handleAddHobby}
              onRemoveHobby={handleRemoveHobby}
            />

            <BrowsingHistorySimulator
              logs={browsingLogs}
              onAddLog={handleAddLog}
              onRemoveLog={handleRemoveLog}
              onResetLogs={handleResetLogs}
            />
          </div>

          {/* Extended Academic and Skills Profile Editor */}
          <StudentProfileEditor
            marks={marks}
            setMarks={setMarks}
            technicalSkills={technicalSkills}
            setTechnicalSkills={setTechnicalSkills}
            softSkills={softSkills}
            setSoftSkills={setSoftSkills}
            workExperience={workExperience}
            setWorkExperience={setWorkExperience}
            educationQualifications={educationQualifications}
            setEducationQualifications={setEducationQualifications}
          />

          {/* AI Coprocessor: Live Compatibility Matrix */}
          <div className="bg-indigo-50/40 p-5 rounded-2xl border border-indigo-100 space-y-4 mt-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                  AI Stream Compatibility Coprocessor (Real-time Local Calculations)
                </h3>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                  This widget calculates immediate stream compatibility based on your selected hobbies and campus Wi-Fi search logs. Click &quot;Run AI Career Path Evaluation&quot; below or above to trigger the deep Gemini AI model.
                </p>
              </div>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 font-mono font-bold px-2.5 py-1 rounded-md border border-indigo-200 uppercase tracking-wider shrink-0">
                ⚡ Live calculations active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {[
                { title: "Science PCM (Eng & Tech)", val: simulatedAffinity.pcm, color: "from-blue-600 to-indigo-500", desc: "Physics, Chem, Math" },
                { title: "Science PCB (Life Sciences)", val: simulatedAffinity.pcb, color: "from-emerald-600 to-teal-500", desc: "Physics, Chem, Biology" },
                { title: "Commerce & Fin", val: simulatedAffinity.commerce, color: "from-amber-600 to-orange-500", desc: "Finance, Biz, Economics" },
                { title: "Liberal Arts & Humanities", val: simulatedAffinity.humanities, color: "from-pink-600 to-rose-500", desc: "Psychology, Sociology, Arts" },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800 block truncate" title={item.title}>{item.title}</span>
                    <span className="font-mono font-bold text-slate-900 text-[11px] shrink-0">{item.val}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.val}%` }} />
                  </div>
                  <span className="text-[9px] text-slate-500 block truncate">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Interactive Outputs */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2.5">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-indigo-600" />
              2. Counseling Analysis & Long-term Progression
            </h2>
            {report && (
              <span className="text-xs text-emerald-600 font-mono font-bold flex items-center gap-1">
                ✓ Report Generated for {report.studentName}
              </span>
            )}
          </div>

          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl space-y-3 shadow-sm">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-rose-900 flex items-center gap-1.5">
                    Gemini AI Integration Configuration Required
                  </h4>
                  <p className="text-xs text-rose-800 leading-relaxed max-w-3xl font-medium">
                    {errorMessage}
                  </p>
                </div>
              </div>
              <div className="text-[11px] text-slate-600 leading-relaxed bg-white/80 p-3 rounded-lg border border-rose-100">
                <span className="font-bold text-rose-700">💡 Quick Guide:</span> To obtain a valid Gemini API key, go to the Google AI Studio console (https://aistudio.google.com/), generate an API key, then click the <strong>Settings</strong> button (represented by a gear icon) in the bottom-left corner of this workspace, choose <strong>Secrets</strong>, add <code>GEMINI_API_KEY</code>, paste your key, and click the evaluate button again!
              </div>
            </div>
          )}

          {!report && !isLoading && (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center max-w-xl mx-auto space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
                <Compass className="w-8 h-8 text-indigo-600 animate-pulse" />
              </div>
              <div className="space-y-1.5 px-4">
                <h3 className="text-base font-bold text-slate-800">No active counseling report loaded</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Your personalized Class 11/12 stream map, hobby justification reports, future professions, and milestone roadmaps will generate here.
                </p>
              </div>
              <button
                onClick={handleRunAnalysis}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm"
              >
                Analyze {studentName || "Student"} Preset
              </button>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-4 shadow-sm">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">AI Counselor Processing Report</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Searching live industry trend datasets, mapping Class 11 & 12 streams, and detailing career progression milestones...
                </p>
              </div>
            </div>
          )}

          {report && !isLoading && (
            <div className="space-y-6">
              {activeTab === "counselor" ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Report summary display (Class 11/12 Streams & Future Career options list) */}
                  <div className="lg:col-span-7">
                    <ReportDisplay
                      report={report}
                      onSelectCareer={(career) => {
                        setSelectedCareer(career);
                      }}
                      selectedCareerTitle={selectedCareer?.careerTitle}
                      studentHobbies={selectedHobbies}
                      technicalSkills={technicalSkills}
                      softSkills={softSkills}
                    />
                  </div>

                  {/* Interactive Advisor Chatbot */}
                  <div className="lg:col-span-5 h-full">
                    <CareerAdvisorChatbot
                      profile={{
                        name: studentName,
                        hobbies: selectedHobbies,
                        browsingLogs,
                        marks,
                        technicalSkills,
                        softSkills,
                        workExperience,
                        educationQualifications
                      }}
                      lastReport={report}
                    />
                  </div>
                </div>
              ) : (
                /* Focused Progression Milestones tracker */
                <div>
                  {selectedCareer ? (
                    <ProgressionDashboard
                      career={selectedCareer}
                      completedMilestoneKeys={completedMilestonesByCareer[selectedCareer.careerTitle] || []}
                      onToggleMilestone={handleToggleMilestone}
                      allCareers={report.longTermCareers}
                      onSelectCareer={(c) => setSelectedCareer(c)}
                    />
                  ) : (
                    <div className="text-center py-10 text-slate-500 font-medium">
                      Please select a future career from the Counselor Report tab to view its progression roadmap.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto text-center text-xs text-slate-500 z-10">
        <p className="font-semibold text-slate-600">© 2026 National Stream & Career Advisor. Powered by search-grounded Gemini 3.5 Flash.</p>
        <p className="mt-1 text-slate-400">Standardized counseling utility for Class 10 students mapping academic milestones transparently.</p>
      </footer>
    </div>
  );
}
