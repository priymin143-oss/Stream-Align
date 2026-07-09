import React, { useState, useEffect } from "react";
import { CareerOption, StudentProfile } from "../types";
import { 
  Users, MessageSquare, Calendar, Compass, Sparkles, Send, 
  UserCheck, ExternalLink, ShieldAlert, CheckCircle, Clock 
} from "lucide-react";

interface ExpertProfile {
  id: string;
  name: string;
  role: string;
  company: string;
  almaMater: string;
  expertise: string[];
  bio: string;
  avatar: string;
  matchPercentage: number;
  availableSlot: string;
}

interface ForumQuestion {
  id: string;
  studentName: string;
  expertName?: string;
  expertRole?: string;
  expertCompany?: string;
  question: string;
  answer?: string;
  timestamp: string;
  careerTag: string;
  isAnswered: boolean;
}

interface IndustryConnectionProps {
  profile: StudentProfile;
  careers: CareerOption[];
  onAwardPoints: (points: number, description: string, badgeKey?: string) => void;
}

const EXPERT_POOL: ExpertProfile[] = [
  {
    id: "e-1",
    name: "Dr. Rohan Deshmukh",
    role: "Senior AI Architect",
    company: "Google DeepMind",
    almaMater: "IIT Bombay / Stanford PhD",
    expertise: ["AI & Full-Stack Systems Architect", "Neural Networks", "Python"],
    bio: "Pioneering state-of-the-art Large Language Models and reinforcement learning frameworks. Passionate about guiding the next generation of deep learning engineers.",
    avatar: "🧑‍💻",
    matchPercentage: 98,
    availableSlot: "Thursdays, 4:00 PM IST"
  },
  {
    id: "e-2",
    name: "Shreya Ghoshal",
    role: "Senior Quantitative Researcher",
    company: "Goldman Sachs",
    almaMater: "BITS Pilani / Wharton MBA",
    expertise: ["Fintech Venture Capital & Quantitative Analyst", "Risk Modeling", "Python"],
    bio: "Ex-algorithmic trader specializing in high-frequency statistical models and seed startup valuations in high-growth fintech corridors.",
    avatar: "👩‍💼",
    matchPercentage: 95,
    availableSlot: "Mondays, 6:30 PM IST"
  },
  {
    id: "e-3",
    name: "Amit Patel",
    role: "Principal Robotics System Lead",
    company: "Tesla Gigafactory",
    almaMater: "IIT Kharagpur / CMU Robotics MS",
    expertise: ["Robotics and Automation Control Specialist", "ROS2", "Sensor Fusion"],
    bio: "Developing safety-critical hardware-in-the-loop controllers and sensor fusion frameworks for self-driving automotive drive blocks.",
    avatar: "👨‍🔧",
    matchPercentage: 92,
    availableSlot: "Wednesdays, 5:00 PM IST"
  },
  {
    id: "e-4",
    name: "Dr. Ananya Nair",
    role: "Lead CRISPR Scientist",
    company: "Biocon Labs",
    almaMater: "IISc Bangalore / Oxford Biotech PhD",
    expertise: ["Biotechnology & CRISPR Gene-Editing Specialist", "Molecular Biology", "CRISPR-Cas9"],
    bio: "Designing molecular therapeutic vectors targeting oncogene expression. Promoting affordable genetic screening tools inside agritech structures.",
    avatar: "👩‍🔬",
    matchPercentage: 94,
    availableSlot: "Fridays, 3:00 PM IST"
  },
  {
    id: "e-5",
    name: "Vikram Sen",
    role: "Director of Product Experience",
    company: "Meta Inc.",
    almaMater: "NID Ahmedabad / HCI Masters Carnegie Mellon",
    expertise: ["Cognitive Interaction & Human-AI Design Specialist", "Behavioral Psychology", "UX Design"],
    bio: "Directing multi-modal user research, cognitive loads optimizations, and natural conversational AI experiences for VR/AR platforms.",
    avatar: "🎨",
    matchPercentage: 91,
    availableSlot: "Tuesdays, 7:00 PM IST"
  }
];

const INITIAL_FORUM: ForumQuestion[] = [
  {
    id: "fq-1",
    studentName: "Aarav",
    expertName: "Dr. Rohan Deshmukh",
    expertRole: "Senior AI Architect",
    expertCompany: "Google DeepMind",
    careerTag: "AI & Full-Stack Systems Architect",
    question: "Is it essential to master C++ before learning Python if I want to go into AI Engineering in college?",
    answer: "No, absolutely not! Python is the undisputed lingua franca of modern machine learning. Start directly with Python, master Pandas/NumPy, and then explore PyTorch. You can learn C++ later for high-performance deployment systems if needed.",
    timestamp: "2 hours ago",
    isAnswered: true
  },
  {
    id: "fq-2",
    studentName: "Priya",
    expertName: "Dr. Ananya Nair",
    expertRole: "Lead CRISPR Scientist",
    expertCompany: "Biocon Labs",
    careerTag: "Biotechnology & CRISPR Gene-Editing Specialist",
    question: "How much chemistry score is required in Class 12 to pursue high-end research in gene therapy?",
    answer: "Hi! While scoring above 85-90% in Class 12 Chemistry ensures smooth admissions into top tier colleges, focus heavily on organic chemistry concepts. Gene sequencing requires a robust cellular biochemistry foundation.",
    timestamp: "Yesterday",
    isAnswered: true
  },
  {
    id: "fq-3",
    studentName: "Rahul",
    careerTag: "Robotics and Automation Control Specialist",
    question: "Are there any student-friendly microcontrollers to start learning ROS2 with hardware?",
    timestamp: "3 days ago",
    isAnswered: false
  }
];

export default function IndustryConnection({ profile, careers, onAwardPoints }: IndustryConnectionProps) {
  const [matchedExperts, setMatchedExperts] = useState<ExpertProfile[]>([]);
  const [forumQuestions, setForumQuestions] = useState<ForumQuestion[]>(INITIAL_FORUM);
  const [newQuestion, setNewQuestion] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [showBookingSuccess, setShowBookingSuccess] = useState<string | null>(null);

  // Match experts dynamically based on student interests/careers
  useEffect(() => {
    if (careers.length === 0) return;

    const matched = EXPERT_POOL.map((expert) => {
      // Find matching categories or roles
      const matchesCareer = careers.some((c) => 
        expert.expertise.includes(c.careerTitle) || 
        c.skillsRequired.some(s => expert.expertise.some(ee => ee.toLowerCase().includes(s.toLowerCase())))
      );
      
      return {
        ...expert,
        matchPercentage: matchesCareer ? Math.floor(Math.random() * 8) + 91 : Math.floor(Math.random() * 15) + 65
      };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);

    setMatchedExperts(matched);
    
    if (careers.length > 0 && !selectedTag) {
      setSelectedTag(careers[0].careerTitle);
    }
  }, [careers]);

  // Submit new forum question
  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    // AI expert auto-assignment simulation
    const targetExpert = matchedExperts.find((e) => e.expertise.includes(selectedTag)) || matchedExperts[0];

    const q: ForumQuestion = {
      id: `fq-${Date.now()}`,
      studentName: profile.name || "Student",
      careerTag: selectedTag,
      question: newQuestion,
      timestamp: "Just now",
      isAnswered: false
    };

    setForumQuestions((prev) => [q, ...prev]);
    setNewQuestion("");

    // Simulate AI answering after 2 seconds
    setTimeout(() => {
      setForumQuestions((prev) => 
        prev.map((item) => {
          if (item.id === q.id) {
            return {
              ...item,
              expertName: targetExpert.name,
              expertRole: targetExpert.role,
              expertCompany: targetExpert.company,
              answer: `Hi ${profile.name}! That is an excellent question. For the "${selectedTag}" pathway, I highly recommend building hands-on projects, focusing on core maths or sciences in Class 11/12, and keeping up with modern industry tools. Always align your hobbies to your technical projects early!`,
              isAnswered: true
            };
          }
          return item;
        })
      );
      // Award gamification points for seeking professional mentoring
      onAwardPoints(100, `AI Expert matching answered your career question regarding: ${selectedTag}`, "insight_seeker");
    }, 2000);

    onAwardPoints(50, "Posted a question on the Industry Expert forum", "insight_seeker");
  };

  const handleBookSession = (expertId: string, expertName: string) => {
    setShowBookingSuccess(expertName);
    onAwardPoints(150, `Booked virtual mentoring session with ${expertName}`, "insight_seeker");
    setTimeout(() => {
      setShowBookingSuccess(null);
    }, 4000);
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
      {/* Upper Ribbon */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 transition-colors duration-300">
        <div className="space-y-1">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            Connect with Industry Professionals
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl">
            Stream Align uses smart profile matching to link you with veteran engineers, scientists, and analysts from elite global firms. Ask persistent questions or schedule virtual mentoring.
          </p>
        </div>
      </div>

      {showBookingSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-xl flex items-center gap-3 animate-fade-in shadow-inner">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <strong className="text-xs font-bold block">Mentorship Session Scheduled!</strong>
            <span className="text-[11px] text-emerald-800">Your virtual session with <strong>{showBookingSuccess}</strong> has been secured. Check your associated email for link credentials.</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Matched Experts Panel */}
        <div className="lg:col-span-5 space-y-4">
          <h4 className="text-[10px] uppercase font-black text-slate-800 dark:text-slate-200 tracking-wider flex items-center gap-1.5 pl-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            Your AI-Matched Experts
          </h4>

          <div className="space-y-4">
            {matchedExperts.map((expert) => (
              <div 
                key={expert.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all shadow-sm flex gap-4"
              >
                {/* Avatar */}
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center shrink-0 text-2xl shadow-inner">
                  {expert.avatar}
                </div>

                {/* Body details */}
                <div className="space-y-2 flex-grow min-w-0">
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                        {expert.name}
                      </span>
                      <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-850 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 font-mono font-black text-[9px] px-2 py-0.5 rounded-full shrink-0">
                        {expert.matchPercentage}% AI Match
                      </span>
                    </div>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold block">
                      {expert.role} @ {expert.company}
                    </span>
                    <span className="text-[9px] text-slate-400 font-semibold block italic">
                      {expert.almaMater}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-medium">
                    {expert.bio}
                  </p>

                  <div className="flex flex-wrap gap-1 items-center pt-1">
                    {expert.expertise.map((exp) => (
                      <span key={exp} className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-350 border border-slate-200/50 dark:border-slate-850 rounded px-1.5 py-0.5 text-[8px] font-mono font-bold">
                        {exp}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-850 mt-1">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{expert.availableSlot}</span>
                    </div>
                    <button
                      onClick={() => handleBookSession(expert.id, expert.name)}
                      className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                    >
                      Book 1:1 Call
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Q&A Forum Area */}
        <div className="lg:col-span-7 space-y-4">
          <h4 className="text-[10px] uppercase font-black text-slate-800 dark:text-slate-200 tracking-wider flex items-center gap-1.5 pl-1">
            <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
            Mentorship Q&A Forum
          </h4>

          {/* Form to submit questions */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors duration-300">
            <h5 className="text-xs font-black text-slate-800 dark:text-slate-150 uppercase tracking-tight mb-3">Ask Matched Experts a Question</h5>
            <form onSubmit={handleSubmitQuestion} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-400">Related Career Topic</label>
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-850 dark:text-slate-150 p-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none"
                  >
                    {careers.map((c) => (
                      <option key={c.careerTitle} value={c.careerTitle}>
                        {c.careerTitle}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase text-slate-400">Your Specific Question</label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="e.g. What specific tools should I build with to make my portfolio competitive in high school? Is CRISPR-Cas9 hard to learn for beginners?"
                    className="w-full bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 rounded-xl p-3 border border-slate-200 dark:border-slate-800 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 transition-all font-medium pr-10"
                  />
                  <button
                    type="submit"
                    className="absolute bottom-3 right-3 bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center"
                    title="Submit Question"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Q&A Thread Stack */}
          <div className="space-y-4">
            {forumQuestions.map((q) => (
              <div 
                key={q.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 transition-colors duration-300"
              >
                {/* Student Query Row */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-800 font-bold">
                      👩‍🎓 {q.studentName} asked
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {q.timestamp}
                    </span>
                  </div>
                  
                  <p className="text-xs font-black text-slate-850 dark:text-slate-150 leading-relaxed">
                    {q.question}
                  </p>

                  <span className="inline-block bg-indigo-50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-400 text-[8px] font-mono font-black px-2 py-0.5 rounded uppercase border border-indigo-100 dark:border-indigo-900">
                    Topic: {q.careerTag}
                  </span>
                </div>

                {/* Expert Response Block */}
                {q.isAnswered ? (
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 p-4 rounded-xl space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                          {q.expertName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          • {q.expertRole} at {q.expertCompany}
                        </span>
                      </div>
                      <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-950 font-mono text-[8px] font-black uppercase px-2 py-0.5 rounded-full">
                        Verified Advisor
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {q.answer}
                    </p>
                  </div>
                ) : (
                  <div className="bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-850 p-4 rounded-xl text-center space-y-2 py-6">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-850 flex items-center justify-center text-xs text-slate-500 mx-auto animate-pulse">
                      ⏳
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Matched Expert is reviewing your query...</p>
                    <p className="text-[10px] text-slate-400 font-medium max-w-sm mx-auto">Our AI matching loop assigns standard forum queries to expert channels inside 5 minutes.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
