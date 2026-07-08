import React, { useState, useEffect } from "react";
import { StudentProfile, AnalysisReport, BrowsingLog, CareerOption, WorkExperience, EducationQualification } from "./types";
import { PRESET_PERSONAS, StudentPersona } from "./data/mockData";
import BrowsingHistorySimulator from "./components/BrowsingHistorySimulator";
import HobbyInterestInput from "./components/HobbyInterestInput";
import StudentProfileEditor from "./components/StudentProfileEditor";
import ReportDisplay from "./components/ReportDisplay";
import ProgressionDashboard from "./components/ProgressionDashboard";
import CareerAdvisorChatbot from "./components/CareerAdvisorChatbot";
import ShiningWaveLogo from "./components/ShiningWaveLogo";
import SkillGapAnalysis from "./components/SkillGapAnalysis";
import JobMarketAlerts from "./components/JobMarketAlerts";
import EmailVerificationWidget from "./components/EmailVerificationWidget";
import { Compass, Sparkles, BookOpen, BrainCircuit, UserCheck, ArrowRight, Loader2, RefreshCw, Star, Award, Shield, Users, Mail, Bell, Flame, Sun, Moon, MessageSquare } from "lucide-react";
import { generateLocalReport, calculateWeightedScore } from "./lib/fallbackGenerator";

export default function App() {
  // Dark Mode state
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) {
        return saved === "dark";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

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
  const [isGlobalChatOpen, setIsGlobalChatOpen] = useState(false);

  // Instant simulated calculations using weighted 51% marks and 49% hobbies formula
  const simulatedAffinity = React.useMemo(() => {
    return {
      pcm: calculateWeightedScore(marks, selectedHobbies, "PCM"),
      pcb: calculateWeightedScore(marks, selectedHobbies, "PCB"),
      commerce: calculateWeightedScore(marks, selectedHobbies, "Commerce"),
      humanities: calculateWeightedScore(marks, selectedHobbies, "Humanities"),
    };
  }, [selectedHobbies, marks]);
  
  // Mode selection
  const [activeTab, setActiveTab] = useState<"counselor" | "milestones" | "gap-analysis" | "alerts" | "gamification">("counselor");

  // Gamification States
  const [points, setPoints] = useState<number>(300);
  const [pointHistory, setPointHistory] = useState<any[]>([
    { id: "h-1", points: 100, description: "Completed initial setup profile configuration", timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: "h-2", points: 100, description: "Configured hobbies & interests database", timestamp: new Date(Date.now() - 1800000).toISOString() },
    { id: "h-3", points: 100, description: "Loaded classroom marks & academic grades", timestamp: new Date(Date.now() - 600000).toISOString() },
  ]);

  const [badges, setBadges] = useState<any[]>([
    { key: "exploration", title: "Exploration Master", description: "Unlock by exploring at least 3 career paths or stream recommendations.", icon: <Compass className="w-5 h-5 text-indigo-500" />, color: "bg-indigo-50/70 border-indigo-200 text-indigo-850", unlocked: false, req: "Explore 3 Career paths" },
    { key: "skill_builder", title: "Skill Builder", description: "Audit your competencies by running a detailed AI Skill Gap Analysis.", icon: <Sparkles className="w-5 h-5 text-amber-500" />, color: "bg-amber-50/70 border-amber-200 text-amber-850", unlocked: false, req: "Run 1 Skill Gap Analysis" },
    { key: "milestone_crusher", title: "Milestone Crusher", description: "Complete educational or professional milestones on your career roadmaps.", icon: <Award className="w-5 h-5 text-emerald-500" />, color: "bg-emerald-50/70 border-emerald-200 text-emerald-850", unlocked: false, req: "Toggle 1 milestone completion" },
    { key: "insight_seeker", title: "Insight Seeker", description: "Interact with the AI Counseling chatbot to ask persistent career questions.", icon: <Star className="w-5 h-5 text-purple-500" />, color: "bg-purple-50/70 border-purple-200 text-purple-850", unlocked: false, req: "Ask questions to Counselor chatbot" },
    { key: "trend_tracker", title: "Trend Tracker", description: "Subscribe or scan live news alerts to monitor actual high-school trends.", icon: <Shield className="w-5 h-5 text-sky-500" />, color: "bg-sky-50/70 border-sky-200 text-sky-850", unlocked: false, req: "Monitor live job streams or Subscribe" }
  ]);

  const handleAwardPoints = (pointsToAdd: number, description: string, badgeKey?: string) => {
    setPoints((prev) => prev + pointsToAdd);
    setPointHistory((prev) => {
      // Avoid adding duplicate log entries for identical actions if needed, but history is clean
      const id = `h-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      return [
        {
          id,
          points: pointsToAdd,
          description,
          timestamp: new Date().toISOString()
        },
        ...prev
      ];
    });

    if (badgeKey) {
      setBadges((prev) =>
        prev.map((badge) => {
          if (badge.key === badgeKey && !badge.unlocked) {
            return { ...badge, unlocked: true };
          }
          return badge;
        })
      );
    }
  };

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
      
      // Award gamification points
      handleAwardPoints(300, "Successfully completed stream & career evaluation using search-grounded Gemini AI", "exploration");
    } catch (error: any) {
      console.warn("Backend API unavailable or failed. Using high-performance Local AI Coprocessor fallback.", error);
      
      // Generate high-fidelity offline local report
      const localData = generateLocalReport(
        studentName,
        selectedHobbies,
        browsingLogs,
        marks,
        technicalSkills,
        softSkills,
        workExperience,
        educationQualifications
      );
      
      setReport(localData);
      
      // Auto-select first career
      if (localData.longTermCareers && localData.longTermCareers.length > 0) {
        setSelectedCareer(localData.longTermCareers[0]);
      }

      // Award fallback gamification points
      handleAwardPoints(200, "Successfully completed stream & career evaluation using Offline Local Coprocessor", "exploration");
    } finally {
      setIsLoading(false);
    }
  };

  // Milestone checkoff helper
  const handleToggleMilestone = (milestoneTitle: string) => {
    if (!selectedCareer) return;
    const careerKey = selectedCareer.careerTitle;
    let isNowCompleted = false;

    setCompletedMilestonesByCareer((prev) => {
      const currentList = prev[careerKey] || [];
      const isCompleted = currentList.includes(milestoneTitle);
      isNowCompleted = !isCompleted;
      const updatedList = isCompleted
        ? currentList.filter((m) => m !== milestoneTitle)
        : [...currentList, milestoneTitle];
      return {
        ...prev,
        [careerKey]: updatedList
      };
    });

    if (isNowCompleted) {
      handleAwardPoints(100, `Completed progression milestone: ${milestoneTitle}`, "milestone_crusher");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white relative transition-colors duration-300">
      {/* Dynamic ambient header glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 sticky top-0 z-50 backdrop-blur shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 flex items-center justify-center rounded-2xl bg-slate-900 shadow-md border border-slate-200 dark:border-slate-800 group overflow-hidden">
              {/* Elegant deep gradient background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-800 via-indigo-950 to-slate-900 opacity-95" />
              {/* Subtle dynamic border glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-amber-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
              
              <div className="relative flex items-center justify-center w-full h-full p-2.5">
                <img src="/favicon.svg" alt="Stream Align Logo" className="w-full h-full object-contain filter drop-shadow group-hover:scale-110 transition-transform duration-300" referrerPolicy="no-referrer" />
              </div>
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex flex-wrap items-center gap-2 font-sans">
                <ShiningWaveLogo text="Stream Align" />
                <span className="text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-full">
                  Stream & Career Portal
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Standardized Class 11-12 stream mapping & futuristic career progression tracker</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all shadow-sm flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode (High Visual Comfort)"}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600 fill-indigo-100" />
              )}
            </button>

            <div className="flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setActiveTab("counselor")}
                className={`text-xs font-bold px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === "counselor"
                    ? "bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Counselor Report & Chat
              </button>
              <button
                onClick={() => setActiveTab("milestones")}
                disabled={!selectedCareer}
                className={`text-xs font-bold px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                  !selectedCareer ? "opacity-50 cursor-not-allowed" : ""
                } ${
                  activeTab === "milestones"
                    ? "bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Progression Dashboard
              </button>
              <button
                onClick={() => setActiveTab("gap-analysis")}
                disabled={!selectedCareer}
                className={`text-xs font-bold px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                  !selectedCareer ? "opacity-50 cursor-not-allowed" : ""
                } ${
                  activeTab === "gap-analysis"
                    ? "bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                AI Skill Gaps
              </button>
              <button
                onClick={() => setActiveTab("alerts")}
                disabled={!selectedCareer}
                className={`text-xs font-bold px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                  !selectedCareer ? "opacity-50 cursor-not-allowed" : ""
                } ${
                  activeTab === "alerts"
                    ? "bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Market Alerts
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 space-y-8 z-10">
        
        {/* Section 1: Dynamic Persona & Input Sandbox */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-450" />
              1. Setup Student Background Sandbox
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium italic">Select a preset to test immediate combinations</span>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {PRESET_PERSONAS.map((persona) => {
              const isSelected = studentName === persona.name;
              return (
                <button
                  key={persona.name}
                  onClick={() => handleSelectPersona(persona)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 relative overflow-hidden shadow-sm cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50/80 dark:bg-indigo-950/20 border-indigo-500 dark:border-indigo-800 ring-1 ring-indigo-500/30 dark:ring-indigo-800/30 text-indigo-950 dark:text-indigo-200"
                      : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span className="text-2xl shrink-0">{persona.avatar}</span>
                  <div className="min-w-0">
                    <span className={`text-xs font-bold block truncate ${isSelected ? "text-indigo-950 dark:text-indigo-200" : "text-slate-800 dark:text-slate-100"}`}>{persona.name}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">{persona.description}</span>
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
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full md:w-1/3">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Student Full Name</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Priyanshu Singh"
                className="w-full bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 rounded-xl p-3 border border-slate-200 dark:border-slate-800 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 transition-all font-medium"
              />
            </div>
            <div className="w-full md:w-2/3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Provide custom campus WiFi searches & hobbies on the cards below. Once prepared, evaluate the profile using our AI core.
              </div>
              <button
                onClick={handleRunAnalysis}
                disabled={isLoading || !studentName.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-indigo-600/10 shrink-0 cursor-pointer"
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

          {/* Email verification optional widget */}
          <EmailVerificationWidget />

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
          <div className="bg-indigo-50/40 dark:bg-indigo-950/10 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-950/30 space-y-4 mt-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                  AI Stream Compatibility Coprocessor (Real-time Local Calculations)
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5">
                  This widget calculates immediate stream compatibility based on your selected hobbies and campus Wi-Fi search logs. Click &quot;Run AI Career Path Evaluation&quot; below or above to trigger the deep Gemini AI model.
                </p>
              </div>
              <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-300 font-mono font-bold px-2.5 py-1 rounded-md border border-indigo-200 dark:border-indigo-850 uppercase tracking-wider shrink-0">
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
                <div key={idx} className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block truncate" title={item.title}>{item.title}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-[11px] shrink-0">{item.val}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.val}%` }} />
                  </div>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 block truncate">{item.desc}</span>
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
                      onMessageSent={() => handleAwardPoints(30, "Consulted with AI Advisor chatbot", "insight_seeker")}
                    />
                  </div>
                </div>
              ) : activeTab === "milestones" ? (
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
              ) : activeTab === "gap-analysis" ? (
                /* AI-powered Skill Gap Analysis feature */
                <SkillGapAnalysis
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
                  careers={report.longTermCareers}
                  onAwardPoints={handleAwardPoints}
                />
              ) : activeTab === "alerts" ? (
                /* Real-time Job Market Alerts feature */
                <JobMarketAlerts
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
                  careerPaths={report.longTermCareers.map((c) => c.careerTitle)}
                  onAwardPoints={handleAwardPoints}
                />
              ) : null}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto text-center text-xs text-slate-500 z-10">
        <p className="font-semibold text-slate-600">© 2026 Stream Align. Powered by search-grounded Gemini 3.5 Flash.</p>
        <p className="mt-1 text-slate-400">Standardized counseling & stream mapping utility for high school students tracking academic milestones transparently.</p>
      </footer>

      {/* Floating Career Advisor Chatbot (Always available across all tabs) */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
        {isGlobalChatOpen && (
          <div className="w-[360px] sm:w-[420px] h-[520px] mb-4 rounded-2xl border border-white/30 dark:border-white/5 shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.3)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex flex-col overflow-hidden animate-fade-in transition-all">
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
              className="h-full border-none shadow-none bg-transparent dark:bg-transparent"
              onMessageSent={() => handleAwardPoints(30, "Consulted with AI Advisor chatbot", "insight_seeker")}
            />
          </div>
        )}

        <button
          onClick={() => setIsGlobalChatOpen(!isGlobalChatOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer border ${
            isGlobalChatOpen
              ? "bg-slate-900 dark:bg-slate-800 text-white border-slate-700/20"
              : "bg-indigo-600 hover:bg-indigo-550 text-white border-indigo-500/20"
          }`}
          title="Consult AI Career Advisor"
        >
          {isGlobalChatOpen ? (
            <span className="text-lg font-bold">✕</span>
          ) : (
            <div className="relative">
              <MessageSquare className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-indigo-600 animate-ping" />
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-indigo-600" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
