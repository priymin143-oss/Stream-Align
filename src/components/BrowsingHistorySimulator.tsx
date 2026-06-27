import React, { useState } from "react";
import { BrowsingLog } from "../types";
import { Chrome, Plus, Trash2, Clock, Eye, AlertCircle, RefreshCw } from "lucide-react";

interface BrowsingHistorySimulatorProps {
  logs: BrowsingLog[];
  onAddLog: (log: Omit<BrowsingLog, "id" | "timestamp">) => void;
  onRemoveLog: (id: string) => void;
  onResetLogs: () => void;
}

export default function BrowsingHistorySimulator({
  logs,
  onAddLog,
  onRemoveLog,
  onResetLogs,
}: BrowsingHistorySimulatorProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<BrowsingLog["category"]>("Technology & Coding");
  const [visitsCount, setVisitsCount] = useState(5);
  const [timeSpentMinutes, setTimeSpentMinutes] = useState(30);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;
    onAddLog({
      url,
      title,
      category,
      visitsCount,
      timeSpentMinutes,
    });
    setUrl("");
    setTitle("");
    setShowAddForm(false);
  };

  // Pre-fill fields for easy testing
  const quickFills = [
    {
      title: "GitHub - Deep Learning Tutorial",
      url: "https://github.com/tensorflow/tensorflow",
      category: "Technology & Coding" as const,
      visits: 12,
      time: 90
    },
    {
      title: "Kaggle - Stock Market Forecasting Datasets",
      url: "https://www.kaggle.com/datasets",
      category: "Business & Finance" as const,
      visits: 8,
      time: 45
    },
    {
      title: "Figma - Material Design 3 UI Kits",
      url: "https://figma.com/community",
      category: "Arts & Design" as const,
      visits: 15,
      time: 110
    },
    {
      title: "MIT Physics - Quantum Mechanics lecture",
      url: "https://physics.mit.edu/lectures",
      category: "Science & Space" as const,
      visits: 6,
      time: 75
    }
  ];

  const handleQuickFill = (item: typeof quickFills[0]) => {
    setTitle(item.title);
    setUrl(item.url);
    setCategory(item.category);
    setVisitsCount(item.visits);
    setTimeSpentMinutes(item.time);
  };

  // Group stats for small visual bar
  const statsByCategory = logs.reduce((acc, log) => {
    acc[log.category] = (acc[log.category] || 0) + log.timeSpentMinutes;
    return acc;
  }, {} as Record<string, number>);

  const totalMinutes = Object.values(statsByCategory).reduce((a, b) => a + b, 0);

  const getCategoryColor = (cat: BrowsingLog["category"]) => {
    switch (cat) {
      case "Technology & Coding": return "bg-blue-600";
      case "Science & Space": return "bg-purple-600";
      case "Business & Finance": return "bg-emerald-600";
      case "Arts & Design": return "bg-rose-600";
      case "Humanities & Writing": return "bg-amber-600";
      default: return "bg-slate-600";
    }
  };

  const getCategoryTextColor = (cat: BrowsingLog["category"]) => {
    switch (cat) {
      case "Technology & Coding": return "text-blue-700 bg-blue-50 border-blue-200";
      case "Science & Space": return "text-purple-700 bg-purple-50 border-purple-200";
      case "Business & Finance": return "text-emerald-700 bg-emerald-50 border-emerald-200";
      case "Arts & Design": return "text-rose-700 bg-rose-50 border-rose-200";
      case "Humanities & Writing": return "text-amber-700 bg-amber-50 border-amber-200";
      default: return "text-slate-700 bg-slate-50/80 border-slate-200";
    }
  };

  return (
    <div id="browsing-history-simulator-card" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Chrome className="w-5 h-5 text-blue-600" />
            School Campus Wi-Fi Logs
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Simulated campus Wi-Fi activity tracking student's reading and website exploration.
          </p>
        </div>
        <button
          onClick={onResetLogs}
          className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-all font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Aggregate Categories Progress bar */}
      {totalMinutes > 0 && (
        <div className="mb-6 p-4 bg-slate-50/50 rounded-xl border border-slate-200/80">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-600">Total Simulated Campus Screen Time</span>
            <span className="text-xs font-bold text-slate-900">{Math.round(totalMinutes / 60)}h {totalMinutes % 60}m</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
            {Object.entries(statsByCategory).map(([cat, mins]) => {
              const pct = (mins / totalMinutes) * 100;
              return (
                <div
                  key={cat}
                  style={{ width: `${pct}%` }}
                  className={`${getCategoryColor(cat as BrowsingLog["category"])} h-full`}
                  title={`${cat}: ${mins} mins (${Math.round(pct)}%)`}
                />
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {Object.entries(statsByCategory).map(([cat, mins]) => {
              const pct = (mins / totalMinutes) * 100;
              return (
                <div key={cat} className="flex items-center gap-1.5 text-[10px]">
                  <span className={`w-2 h-2 rounded-full ${getCategoryColor(cat as BrowsingLog["category"])}`} />
                  <span className="text-slate-600 font-semibold">{cat}</span>
                  <span className="text-slate-400">({Math.round(pct)}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Log list */}
      <div className="space-y-2.5 max-h-[310px] overflow-y-auto pr-1">
        {logs.length === 0 ? (
          <div className="text-center py-8 text-slate-400 flex flex-col items-center gap-2">
            <AlertCircle className="w-8 h-8 text-slate-300" />
            <span className="text-sm font-bold">No school campus Wi-Fi logs recorded.</span>
            <span className="text-xs font-medium">Add standard entries or choose a student preset from above.</span>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="group flex items-center justify-between p-3.5 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-all"
            >
              <div className="flex-1 min-w-0 pr-3">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${getCategoryTextColor(log.category)}`}>
                    {log.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
                    <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {log.visitsCount} visits</span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {log.timeSpentMinutes} min</span>
                  </div>
                </div>
                <h4 className="text-xs font-bold text-slate-800 truncate">{log.title}</h4>
                <p className="text-[10px] text-blue-600 hover:underline truncate mt-0.5 font-mono font-medium">{log.url}</p>
              </div>
              <button
                onClick={() => onRemoveLog(log.id)}
                className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                title="Delete this entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Expandable Add Log Form */}
      <div className="mt-4 border-t border-slate-100 pt-4">
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full text-xs font-bold py-2.5 text-blue-600 hover:text-blue-700 bg-blue-50/50 hover:bg-blue-50 border border-blue-200 hover:border-blue-300 rounded-xl flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Simulated Wi-Fi Browsing Entry
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Simulate Network Browsing Log</h4>
            
            <div className="grid grid-cols-2 gap-2">
              {quickFills.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickFill(q)}
                  className="text-[10px] font-semibold text-left px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 truncate"
                >
                  ⚡ {q.title.split(" - ")[0]}
                </button>
              ))}
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Page Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Wikipedia Astrophysics - Exoplanets"
                  className="w-full bg-white text-slate-800 rounded-lg p-2 border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-500 font-semibold mb-1">URL</label>
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="e.g., https://en.wikipedia.org/wiki/Exoplanet"
                  className="w-full bg-white text-slate-800 rounded-lg p-2 border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 font-medium"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Aptitude Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-white text-slate-800 rounded-lg p-2 border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 font-medium"
                  >
                    <option value="Technology & Coding">Technology & Coding</option>
                    <option value="Science & Space">Science & Space</option>
                    <option value="Business & Finance">Business & Finance</option>
                    <option value="Arts & Design">Arts & Design</option>
                    <option value="Humanities & Writing">Humanities & Writing</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Visits</label>
                    <input
                      type="number"
                      min="1"
                      value={visitsCount}
                      onChange={(e) => setVisitsCount(parseInt(e.target.value) || 1)}
                      className="w-full bg-white text-slate-800 rounded-lg p-2 border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Mins Spent</label>
                    <input
                      type="number"
                      min="1"
                      value={timeSpentMinutes}
                      onChange={(e) => setTimeSpentMinutes(parseInt(e.target.value) || 1)}
                      className="w-full bg-white text-slate-800 rounded-lg p-2 border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-1 text-xs">
              <button
                type="submit"
                className="flex-1 font-bold py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-sm"
              >
                Insert Log
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
