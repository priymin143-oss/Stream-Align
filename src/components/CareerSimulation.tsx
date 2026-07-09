import React, { useState, useEffect } from "react";
import { CareerOption, StudentProfile } from "../types";
import { 
  Compass, Sparkles, AlertTriangle, ArrowRight, BookOpen, Clock, 
  TrendingUp, Shield, GraduationCap, Trophy, HelpCircle, ArrowLeftRight 
} from "lucide-react";

interface CareerSimulationProps {
  profile: StudentProfile;
  careers: CareerOption[];
  onAwardPoints: (points: number, description: string, badgeKey?: string) => void;
}

export default function CareerSimulation({ profile, careers, onAwardPoints }: CareerSimulationProps) {
  const [selectedCareer, setSelectedCareer] = useState<CareerOption | null>(careers[0] || null);
  
  // Variables for simulation
  const [grade, setGrade] = useState<"11th" | "12th">("11th");
  const [additionalEducation, setAdditionalEducation] = useState<"none" | "industry-certs" | "integrated-masters" | "study-abroad">("none");
  const [skillFocus, setSkillFocus] = useState<"none" | "tech-skills" | "soft-skills" | "both">("none");

  // Local calculation outputs
  const [simulatedMetrics, setSimulatedMetrics] = useState({
    startingSalaryMultiplier: 1.0,
    promotionSpeed: "Standard", // Standard, Accelerated, Rocket
    marketResilience: "Moderate", // Low, Moderate, High, Exceptional
    specializationScore: 70, // 0 to 100
    timelineYearsToPeak: 11,
  });

  const [simulatedTrajectory, setSimulatedTrajectory] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [alternativePath, setAlternativePath] = useState<any>(null);

  // Synchronize selected career
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

  // Recalculate simulation state when inputs change
  useEffect(() => {
    if (!selectedCareer) return;

    // 1. Multipliers based on variables
    let salaryMult = 1.0;
    let speed = "Standard";
    let resilience = "Moderate";
    let specScore = 70;
    let years = 11;

    // Grade impact: starting early (11th) gives a slight boost to skills and earlier milestones
    if (grade === "11th") {
      salaryMult += 0.05;
      specScore += 5;
    }

    // Additional Education impact
    if (additionalEducation === "industry-certs") {
      salaryMult += 0.15;
      specScore += 15;
      resilience = "High";
    } else if (additionalEducation === "integrated-masters") {
      salaryMult += 0.35;
      speed = "Accelerated";
      specScore += 20;
      years = 10; // saves 1 year in total timeline
    } else if (additionalEducation === "study-abroad") {
      salaryMult += 0.40;
      resilience = "High";
      specScore += 10;
    }

    // Skill focus impact
    if (skillFocus === "tech-skills") {
      salaryMult += 0.10;
      specScore += 10;
    } else if (skillFocus === "soft-skills") {
      speed = "Accelerated";
      resilience = "High";
    } else if (skillFocus === "both") {
      salaryMult += 0.25;
      speed = "Rocket";
      resilience = "Exceptional";
      specScore += 15;
      years = 9; // accelerated promotion saves more years
    }

    setSimulatedMetrics({
      startingSalaryMultiplier: parseFloat(salaryMult.toFixed(2)),
      promotionSpeed: speed,
      marketResilience: resilience,
      specializationScore: Math.min(100, specScore),
      timelineYearsToPeak: years,
    });

    // 2. Map standard milestones to Simulated Timeline
    const simulatedSteps = selectedCareer.milestones.map((milestone, idx) => {
      let timelineText = milestone.timeline;
      let title = milestone.title;
      let description = milestone.description;
      let skills = [...milestone.skillsToAcquire];
      
      // Customize based on simulation variables
      if (idx === 0) {
        timelineText = grade === "11th" ? "Class 11 & 12 (Next 2 years)" : "Class 12 (Next 1 year)";
        if (skillFocus === "tech-skills" || skillFocus === "both") {
          skills.push("Advanced Technical Electives");
        }
      } else if (idx === 1) {
        if (additionalEducation === "study-abroad") {
          title = `Global ${milestone.title} (International University)`;
          description = `Attend a world-renowned overseas institution. ${milestone.description}`;
          skills.push("Intercultural Collaboration", "Global Tech Frameworks");
        }
      } else if (idx === 2) {
        if (additionalEducation === "integrated-masters") {
          title = "Integrated Dual-Degree M.Tech / M.S.";
          description = "Graduate with an advanced Master's degree in a streamlined dual program, bypassing normal entry exams.";
        }
        if (additionalEducation === "industry-certs") {
          skills.push("Professional Domain Certifications (AWS/Google/CFA/GeneEditing)");
        }
      } else if (idx === 4) {
        // Peak Achievement
        if (skillFocus === "both") {
          title = `Executive ${milestone.title}`;
          description = `Accelerated management pathway. ${milestone.description}`;
        }
      }

      return {
        ...milestone,
        title,
        timeline: timelineText,
        description,
        skillsToAcquire: skills
      };
    });

    setSimulatedTrajectory(simulatedSteps);

    // 3. Define Challenges based on Career & Variables
    const standardChallenges = [
      {
        id: "ch-1",
        title: "Intense Admission Competition",
        description: "High cutoff scores and competitive national exams (like JEE, NEET, or CAT) represent a major hurdle.",
        severity: "High",
        mitigatedBy: additionalEducation === "study-abroad" || additionalEducation === "integrated-masters" 
          ? "Mitigated: Alternate admission pathways or global applications bypass high local constraints." 
          : "Mitigation Tip: Build a strong profile portfolio to stand out.",
        isMitigated: additionalEducation === "study-abroad" || additionalEducation === "integrated-masters"
      },
      {
        id: "ch-2",
        title: "Evolving Tech & AI Automation",
        description: "Rapidly changing industry frameworks threaten to automate beginner-level tasks in this field.",
        severity: "Medium",
        mitigatedBy: skillFocus === "tech-skills" || skillFocus === "both" || additionalEducation === "industry-certs"
          ? "Mitigated: Active technical and certification focus ensures you master top-tier tools that are safe from automation."
          : "Mitigation Tip: Invest in active continuous learning.",
        isMitigated: skillFocus === "tech-skills" || skillFocus === "both" || additionalEducation === "industry-certs"
      },
      {
        id: "ch-3",
        title: "Leadership & Collaboration Gaps",
        description: "Highly specialized technical experts often hit a promotion ceiling due to a lack of core people-management skills.",
        severity: "Medium",
        mitigatedBy: skillFocus === "soft-skills" || skillFocus === "both"
          ? "Mitigated: Proactive focus on communications, presentation, and team management prepares you for early leadership roles."
          : "Mitigation Tip: Practice project management and public speaking.",
        isMitigated: skillFocus === "soft-skills" || skillFocus === "both"
      }
    ];
    setChallenges(standardChallenges);

    // 4. Generate Alternative Paths
    let altTitle = "Consulting & Enterprise Solution Architect";
    let altDesc = "Pivoting towards technology consulting and enterprise systems management, blending leadership skills with specialized engineering concepts.";
    let altSkills = ["Enterprise Systems", "Agile Product Management", "Corporate Communication"];

    if (selectedCareer.careerTitle.toLowerCase().includes("biotech") || selectedCareer.careerTitle.toLowerCase().includes("robotics")) {
      altTitle = "Healthcare Operations & Product Manager";
      altDesc = "Managing complex clinical pipelines or hardware manufacturing divisions, optimizing cross-functional technical teams.";
      altSkills = ["Agile Management", "Bioinformatics Operations", "Quality Assurance"];
    } else if (selectedCareer.careerTitle.toLowerCase().includes("fintech") || selectedCareer.careerTitle.toLowerCase().includes("venture")) {
      altTitle = "Corporate Financial Strategist & Treasury Manager";
      altDesc = "Directing financial policies and asset management strategies inside fortune 500 corporations.";
      altSkills = ["Corporate Tax Planning", "Treasury Algorithms", "Strategic Negotiation"];
    } else if (selectedCareer.careerTitle.toLowerCase().includes("design") || selectedCareer.careerTitle.toLowerCase().includes("human")) {
      altTitle = "Creative Agency Director & Brand Strategist";
      altDesc = "Leading major digital branding agencies, organizing behavioral studies, and defining interactive product styles.";
      altSkills = ["Creative Pitching", "Team Scaling", "Advanced Interaction Theory"];
    }

    setAlternativePath({
      title: altTitle,
      description: altDesc,
      skillsToAcquire: altSkills
    });

  }, [selectedCareer, grade, additionalEducation, skillFocus]);

  const triggerGamification = () => {
    onAwardPoints(150, `Simulated custom trajectory variables for career: ${selectedCareer?.careerTitle}`, "milestone_crusher");
  };

  if (careers.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-slate-500 font-medium">
        Please generate a Counseling Report first by completing your student profile and clicking "Run AI Career Path Evaluation".
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upper Ribbons */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 transition-colors duration-300">
        <div className="space-y-1">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-600 animate-spin-slow" />
            Dynamic Career Trajectory Simulation
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl">
            Model alternative futures by selecting high school variables, advanced degrees, and specialized focus skills to see their instant projected outcomes.
          </p>
        </div>
        <div className="shrink-0">
          <button
            onClick={triggerGamification}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5" />
            Lock In Trajectory (+150 Pts)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Hand: Variable Setup Dashboard */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-5 transition-colors duration-300">
          <h4 className="text-[10px] uppercase font-black text-slate-800 dark:text-slate-200 tracking-wider flex items-center gap-1 border-b border-slate-100 dark:border-slate-850 pb-2">
            ⚙️ Choose Trajectory Variables
          </h4>

          {/* Target Career Selection */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase text-slate-400">Target Career</label>
            <select
              value={selectedCareer?.careerTitle || ""}
              onChange={(e) => {
                const found = careers.find(c => c.careerTitle === e.target.value);
                if (found) setSelectedCareer(found);
              }}
              className="w-full bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-850 dark:text-slate-150 p-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none"
            >
              {careers.map((c) => (
                <option key={c.careerTitle} value={c.careerTitle}>
                  {c.careerTitle}
                </option>
              ))}
            </select>
          </div>

          {/* Grade selection */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase text-slate-400">Your Current Grade</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "11th", label: "Class 11th" },
                { id: "12th", label: "Class 12th" }
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGrade(g.id as any)}
                  className={`p-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer text-center ${
                    grade === g.id
                      ? "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-300 border-indigo-400 dark:border-indigo-800"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Education Variables */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase text-slate-400">Additional Education Path</label>
            <div className="grid grid-cols-1 gap-1.5">
              {[
                { id: "none", label: "Standard Undergrad Only" },
                { id: "industry-certs", label: "Professional Certifications" },
                { id: "integrated-masters", label: "Integrated 5-Yr Dual Masters" },
                { id: "study-abroad", label: "Global Overseas Degree" }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setAdditionalEducation(opt.id as any)}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                    additionalEducation === opt.id
                      ? "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-300 border-indigo-400 dark:border-indigo-800 font-bold"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                  }`}
                >
                  <span>{opt.label}</span>
                  {additionalEducation === opt.id && <span className="text-[10px] text-indigo-600 dark:text-indigo-400">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Skill Focus Variable */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase text-slate-400">Skill Specialization Focus</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "none", label: "Balanced" },
                { id: "tech-skills", label: "Deep Tech" },
                { id: "soft-skills", label: "Lead/Soft" },
                { id: "both", label: "Dual Specialist" }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSkillFocus(opt.id as any)}
                  className={`p-2.5 text-[11px] leading-snug font-bold rounded-xl border transition-all text-center flex flex-col justify-center items-center cursor-pointer ${
                    skillFocus === opt.id
                      ? "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-300 border-indigo-400 dark:border-indigo-800"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Simulated Impact Metrics Block */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h5 className="text-[10px] font-black uppercase text-slate-700 dark:text-slate-350 tracking-wider">Simulated Trajectory Impact</h5>
            
            {/* Earning potential */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Salary Potential:</span>
                <span className="font-extrabold text-emerald-700 dark:text-emerald-450">+{Math.round((simulatedMetrics.startingSalaryMultiplier - 1.0) * 100)}% Boost</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (simulatedMetrics.startingSalaryMultiplier / 1.5) * 100)}%` }}
                />
              </div>
            </div>

            {/* Promotion speed */}
            <div className="flex justify-between items-center text-xs pt-1">
              <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-indigo-500" /> Career Velocity:</span>
              <span className={`font-black font-mono text-[10px] px-2 py-0.5 rounded-full uppercase ${
                simulatedMetrics.promotionSpeed === "Rocket" ? "bg-amber-100 text-amber-900 border border-amber-250" :
                simulatedMetrics.promotionSpeed === "Accelerated" ? "bg-indigo-50 text-indigo-900 border border-indigo-200" :
                "bg-slate-200 text-slate-700 dark:bg-slate-850 dark:text-slate-350"
              }`}>{simulatedMetrics.promotionSpeed}</span>
            </div>

            {/* Market resilience */}
            <div className="flex justify-between items-center text-xs pt-1">
              <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-indigo-500" /> Layoff Resilience:</span>
              <span className={`font-black text-[10px] uppercase ${
                simulatedMetrics.marketResilience === "Exceptional" ? "text-emerald-600" :
                simulatedMetrics.marketResilience === "High" ? "text-indigo-600" : "text-slate-500"
              }`}>{simulatedMetrics.marketResilience}</span>
            </div>

            {/* Timeline years */}
            <div className="flex justify-between items-center text-xs pt-1">
              <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5 text-indigo-500" /> Years to Peak:</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200">{simulatedMetrics.timelineYearsToPeak} Years</span>
            </div>
          </div>
        </div>

        {/* Right Hand: Interactive Simulation Output */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Visual Steps Map */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 transition-colors duration-300">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-850">
              <h4 className="text-xs font-black uppercase text-slate-850 dark:text-slate-150 tracking-wider">
                📈 Simulated Career Trajectory: <span className="text-indigo-600 dark:text-indigo-400">{selectedCareer?.careerTitle}</span>
              </h4>
              <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800 font-mono font-bold">
                {grade === "11th" ? "Class 11 Starting Plan" : "Class 12 Starting Plan"}
              </span>
            </div>

            {/* Simulated Interactive Roadmap Steps */}
            <div className="relative border-l-2 border-dashed border-indigo-150 pl-6 ml-3 space-y-8">
              {simulatedTrajectory.map((step, idx) => (
                <div key={idx} className="relative group">
                  {/* Step Marker Node */}
                  <span className="absolute -left-[35px] top-0.5 w-6 h-6 rounded-full bg-slate-950 border-2 border-indigo-400 flex items-center justify-center text-[10px] font-black text-white shadow-sm z-10">
                    {idx + 1}
                  </span>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h5 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 transition-colors">
                        {step.title}
                      </h5>
                      <span className="bg-indigo-50 dark:bg-indigo-950/20 text-indigo-950 dark:text-indigo-300 border border-indigo-150 dark:border-indigo-850 font-mono font-bold text-[9px] px-2.5 py-0.5 rounded-lg shrink-0">
                        {step.timeline}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      {step.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 items-center pt-1.5">
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider shrink-0 mr-1">Skills to Gain:</span>
                      {step.skillsToAcquire.map((skill: string) => (
                        <span key={skill} className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-0.5 text-[9px] font-mono text-slate-700 dark:text-slate-350 font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {step.salaryRange && step.salaryRange !== "N/A" && (
                      <div className="flex items-center gap-1.5 pt-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-450 font-mono">
                        <span>💰 Est. Income:</span>
                        <span>{step.salaryRange}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mitigating Challenges Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 transition-colors duration-300">
            <h4 className="text-xs font-black uppercase text-slate-850 dark:text-slate-150 tracking-wider flex items-center gap-1 border-b border-slate-100 dark:border-slate-850 pb-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Potential Roadblocks & Simulation Mitigation
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {challenges.map((ch) => (
                <div 
                  key={ch.id} 
                  className={`p-4 rounded-xl border transition-all flex flex-col gap-2 relative overflow-hidden ${
                    ch.isMitigated
                      ? "bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/50"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200">{ch.title}</span>
                    <span className={`font-mono text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      ch.isMitigated 
                        ? "bg-emerald-100 text-emerald-900 border border-emerald-200" 
                        : "bg-rose-100 text-rose-900 border border-rose-200"
                    }`}>{ch.isMitigated ? "Mitigated" : `${ch.severity} Risk`}</span>
                  </div>
                  
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    {ch.description}
                  </p>

                  <div className={`mt-auto text-[10px] font-bold leading-normal p-2 rounded-lg border ${
                    ch.isMitigated
                      ? "bg-emerald-100/50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20"
                      : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-850"
                  }`}>
                    {ch.mitigatedBy}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pivot Options / Alternative Pathways */}
          {alternativePath && (
            <div className="bg-gradient-to-r from-indigo-50 to-indigo-50/30 dark:from-indigo-950/10 dark:to-transparent border border-indigo-150 dark:border-indigo-850 rounded-2xl p-5 shadow-sm space-y-3 transition-colors duration-300">
              <h4 className="text-xs font-black uppercase text-indigo-950 dark:text-indigo-200 tracking-wider flex items-center gap-1.5">
                <ArrowLeftRight className="w-4 h-4 text-indigo-600" />
                Alternative Path Pivot Options (Based on Variable adjustments)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-3xl">
                If you choose to pivot or if industry dynamics shift, your configured skill and master's credentials support an immediate, high-paying transition to:
              </p>
              
              <div className="bg-white dark:bg-slate-900/40 p-4 rounded-xl border border-indigo-100 dark:border-indigo-950 shadow-inner flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-black text-slate-900 dark:text-white tracking-tight">{alternativePath.title}</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-normal max-w-2xl">{alternativePath.description}</p>
                </div>
                <div className="flex flex-wrap gap-1 items-center md:justify-end">
                  {alternativePath.skillsToAcquire.map((s: string) => (
                    <span key={s} className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-300 border border-indigo-150 dark:border-indigo-850 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
