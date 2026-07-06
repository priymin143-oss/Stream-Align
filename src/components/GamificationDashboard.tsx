import React from "react";
import { Award, Star, Compass, Shield, Users, HelpCircle, ArrowRight, Zap, Trophy, Flame } from "lucide-react";

interface Badge {
  key: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  unlocked: boolean;
  req: string;
}

interface PointHistoryItem {
  id: string;
  points: number;
  description: string;
  timestamp: string;
}

interface GamificationDashboardProps {
  studentName: string;
  points: number;
  pointHistory: PointHistoryItem[];
  badges: Badge[];
}

export default function GamificationDashboard({ studentName, points, pointHistory, badges }: GamificationDashboardProps) {
  // Determine level & title based on points
  const getLevelInfo = (score: number) => {
    if (score < 200) return { level: 1, title: "Career Initiate", nextThreshold: 200 };
    if (score < 500) return { level: 2, title: "Skill Apprentice", nextThreshold: 500 };
    if (score < 1000) return { level: 3, title: "Exploration Master", nextThreshold: 1000 };
    return { level: 4, title: "Industry Strategist", nextThreshold: 2000 };
  };

  const levelInfo = getLevelInfo(points);
  const currentLevelProgress = points;
  const progressPercent = Math.min((points / levelInfo.nextThreshold) * 100, 100);

  // Simulated Leaderboard comprising other students in the class
  const classPeers = [
    { name: "Zoya Malik", points: 1250, avatar: "👩‍💻", title: "Exploration Master" },
    { name: "Ryan Patel", points: 950, avatar: "🧑‍💻", title: "Skill Apprentice" },
    { name: studentName, points: points, avatar: "🎓", title: levelInfo.title, isUser: true },
    { name: "Devika Iyer", points: 700, avatar: "👩‍🔬", title: "Skill Apprentice" },
    { name: "Kabir Mehta", points: 450, avatar: "🧑‍🎨", title: "Career Initiate" },
  ];

  // Sort leaderboard dynamically based on points
  const sortedLeaderboard = [...classPeers].sort((a, b) => b.points - a.points);

  return (
    <div id="gamification-section" className="space-y-6">
      {/* Overview Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Score and Level Widget */}
        <div className="md:col-span-8 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 relative overflow-hidden flex flex-col justify-between shadow-md">
          {/* Subtle decoration vector */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400">Student Profile Status</span>
                <h3 className="text-xl font-black text-white flex items-center gap-1.5 leading-none">
                  Level {levelInfo.level}: {levelInfo.title}
                </h3>
              </div>
              <div className="w-10 h-10 bg-indigo-500/20 border border-indigo-400/30 rounded-xl flex items-center justify-center">
                <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
              </div>
            </div>

            {/* Point Radial display bar */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Total Score:</span>
                <span className="text-slate-100 font-mono text-sm">{points} XP / {levelInfo.nextThreshold} XP</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                Earn <span className="font-extrabold text-indigo-400">XP points</span> and unlock rare badges by completing profile sections, analyzing career pathways, auditing skill gaps, and tracking real-time market trends.
              </p>
            </div>
          </div>

          <div className="flex gap-4 pt-6 mt-4 border-t border-slate-800 flex-wrap text-center sm:text-left justify-center sm:justify-start">
            <div className="bg-slate-800/60 border border-slate-700/50 px-4 py-2 rounded-xl">
              <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Unlocked Achievements</span>
              <span className="text-sm font-black text-white font-mono">{badges.filter(b => b.unlocked).length} Badges</span>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/50 px-4 py-2 rounded-xl">
              <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Counselor Engagements</span>
              <span className="text-sm font-black text-white font-mono">{pointHistory.length} Submissions</span>
            </div>
          </div>
        </div>

        {/* Level badge vector */}
        <div className="md:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center text-indigo-600 border border-indigo-200/60 shadow-inner">
            <Trophy className="w-8 h-8 text-indigo-600" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">Global Class Rank</h4>
            <p className="text-2xl font-black text-slate-800 font-mono leading-none">
              #{sortedLeaderboard.findIndex(p => p.isUser) + 1} <span className="text-xs text-slate-400 font-bold">of 5</span>
            </p>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-block mt-1">
              Active Stream Alignment Class
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Grid: Badges Panel */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-600" />
              Achievement Credentials & Badges
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">
              Hover/inspect earned credentials. Build concrete competencies to unlock locked credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.key}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                  badge.unlocked
                    ? `${badge.color} border-slate-200 shadow-sm`
                    : "bg-slate-50/50 text-slate-400 border-slate-200/60 opacity-60"
                }`}
              >
                {/* Badge Icon Wrapper */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${
                  badge.unlocked
                    ? "bg-white text-indigo-600 border-slate-100"
                    : "bg-slate-100 text-slate-400 border-slate-200"
                }`}>
                  {badge.icon}
                </div>

                <div className="space-y-1 flex-grow">
                  <div className="flex justify-between items-center gap-2">
                    <h5 className={`text-xs font-black tracking-tight ${badge.unlocked ? "text-slate-800" : "text-slate-500"}`}>
                      {badge.title}
                    </h5>
                    <span className={`text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded-full ${
                      badge.unlocked
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-slate-100 text-slate-400 border border-slate-200"
                    }`}>
                      {badge.unlocked ? "Earned" : "Locked"}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed font-medium text-slate-500">
                    {badge.description}
                  </p>
                  <p className="text-[9px] font-mono font-semibold text-indigo-600/80">
                    {badge.req}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Grid: Leaderboard & Recent Activity Feed */}
        <div className="lg:col-span-4 space-y-6">
          {/* Leaderboard Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                Classroom Leaderboard
              </h4>
              <p className="text-[10px] text-slate-400 font-medium">Friendly peer comparison for Class 11 alignment.</p>
            </div>

            <div className="space-y-2">
              {sortedLeaderboard.map((peer, idx) => {
                const isUser = peer.isUser;
                return (
                  <div
                    key={peer.name}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      isUser
                        ? "bg-indigo-50 border-indigo-200 shadow-sm"
                        : "bg-white border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-black font-mono text-slate-400 w-4 text-center">
                        {idx + 1}
                      </span>
                      <span className="text-lg">{peer.avatar}</span>
                      <div className="space-y-0.5">
                        <span className={`text-xs block leading-none ${isUser ? "font-black text-indigo-950" : "font-extrabold text-slate-800"}`}>
                          {peer.name} {isUser && "(You)"}
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium block">
                          {peer.title}
                        </span>
                      </div>
                    </div>

                    <span className={`text-xs font-bold font-mono ${isUser ? "text-indigo-800 font-black" : "text-slate-800"}`}>
                      {peer.points} XP
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Points History Feed */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-indigo-600" />
                Points Ledger
              </h4>
              <p className="text-[10px] text-slate-400 font-medium">Your chronological engagement points.</p>
            </div>

            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {pointHistory.length === 0 ? (
                <p className="text-[11px] text-slate-400 font-medium italic text-center py-4">No points claimed yet.</p>
              ) : (
                pointHistory.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-700 font-bold leading-tight block">
                        {item.description}
                      </span>
                      <span className="text-[8px] text-slate-400 font-mono block">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <span className="text-[10px] font-black font-mono text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded shrink-0">
                      +{item.points} XP
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
