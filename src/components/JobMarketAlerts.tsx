import React, { useState, useEffect } from "react";
import { StudentProfile } from "../types";
import { Bell, Search, Globe, Filter, ExternalLink, RefreshCw, AlertCircle, ShieldAlert, Sparkles, UserCheck, Mail } from "lucide-react";

interface AlertItem {
  id: string;
  type: "job_trend" | "skill_trend" | "hiring_alert" | "certification_update";
  title: string;
  description: string;
  source: string;
  trendingSkills: string[];
  urgency: "high" | "medium" | "low";
  companyName?: string;
}

interface JobMarketAlertsProps {
  profile: StudentProfile;
  careerPaths: string[];
  onAwardPoints: (points: number, description: string, badgeKey?: string) => void;
}

export default function JobMarketAlerts({ profile, careerPaths, onAwardPoints }: JobMarketAlertsProps) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Load initial alerts based on profile paths
  useEffect(() => {
    if (careerPaths.length > 0) {
      fetchAlerts();
    }
  }, [careerPaths]);

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/career/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          careerPaths: careerPaths.length > 0 ? careerPaths : ["Software Architect", "Biotechnologist"],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to scan current live job boards.");
      }

      const data = await response.json();
      setAlerts(data.alerts || []);
      setHasLoadedOnce(true);

      // Award points for live monitoring
      onAwardPoints(100, "Monitored live job boards & industry news streams", "trend_tracker");
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSubscribe = () => {
    const nextState = !isSubscribed;
    setIsSubscribed(nextState);
    if (nextState) {
      onAwardPoints(50, "Subscribed to real-time custom email alerts for counseling trends", "trend_tracker");
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (filterType === "all") return true;
    return alert.type === filterType;
  });

  const getUrgencyStyles = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-rose-50 text-rose-800 border-rose-200";
      case "medium":
        return "bg-amber-50 text-amber-800 border-amber-200";
      default:
        return "bg-sky-50 text-sky-800 border-sky-200";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "hiring_alert":
        return "💼";
      case "skill_trend":
        return "📊";
      case "certification_update":
        return "🎓";
      default:
        return "🔔";
    }
  };

  const getNiceTypeName = (type: string) => {
    switch (type) {
      case "hiring_alert":
        return "Hiring Alert";
      case "skill_trend":
        return "Skill Demand Trend";
      case "certification_update":
        return "Credentials Launch";
      default:
        return "General Market Alert";
    }
  };

  if (careerPaths.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 font-medium">
        Please generate a Counseling Report first by completing your student profile and clicking "Analyze Student Preset" to monitor real-time job market channels.
      </div>
    );
  }

  return (
    <div id="alerts-section" className="space-y-6">
      {/* Upper Alerts Settings Ribbon */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600 animate-swing" />
            Live Job Board & Industry News Alerts
          </h3>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-2xl">
            Stream Align checks search-grounded indexes continuously to identify hiring surges, trending credentials, and certification updates tailored to your specific profiles: <strong className="text-slate-700">{careerPaths.join(", ")}</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchAlerts}
            disabled={loading}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Scanning..." : "Monitor Live Streams"}
          </button>

          <button
            onClick={handleToggleSubscribe}
            className={`font-bold text-xs px-4 py-2.5 rounded-xl border transition-all flex items-center gap-1.5 ${
              isSubscribed
                ? "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
            }`}
          >
            <Mail className={`w-3.5 h-3.5 ${isSubscribed ? "fill-emerald-100" : ""}`} />
            {isSubscribed ? "Subscribed to Alerts" : "Email Alerts Setup"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Category Filters & Stream Config */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
          <h4 className="text-[10px] uppercase font-black text-slate-800 tracking-wider flex items-center gap-1 pb-2 border-b border-slate-100">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            Filter Alerts
          </h4>

          <div className="flex flex-row flex-wrap lg:flex-col gap-1.5">
            {[
              { id: "all", label: "All Live Alerts", icon: "🌐" },
              { id: "hiring_alert", label: "Hiring Openings", icon: "💼" },
              { id: "skill_trend", label: "Skill Demands", icon: "📊" },
              { id: "certification_update", label: "Certification news", icon: "🎓" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-2 ${
                  filterType === f.id
                    ? "bg-indigo-50 text-indigo-900 border-indigo-200 font-bold"
                    : "bg-white text-slate-600 hover:bg-slate-50 border-transparent"
                }`}
              >
                <span>{f.icon}</span>
                {f.label}
              </button>
            ))}
          </div>

          <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/40 text-[10px] text-slate-500 leading-relaxed font-medium">
            <span className="font-extrabold text-indigo-900 block mb-0.5">💡 Pro-Tip:</span>
            Alerts contain live resources linked to active portals like Coursera, AWS, and LinkedIn. Click external URLs to evaluate hiring requisites!
          </div>
        </div>

        {/* Right Side: Alerts Listing */}
        <div className="lg:col-span-9 space-y-4">
          {loading && (
            <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center space-y-4 flex flex-col items-center justify-center min-h-[300px] shadow-sm">
              <RefreshCw className="w-10 h-10 animate-spin text-indigo-600" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Scraping Live Industry Directories</h4>
                <p className="text-xs text-slate-500 font-medium max-w-sm">
                  Querying recent job listings, startup funding databases, and professional credentials for 2026/2027 parameters...
                </p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3">
              <ShieldAlert className="w-8 h-8 text-rose-500 mx-auto" />
              <p className="text-xs text-rose-800 font-bold">{error}</p>
              <button onClick={fetchAlerts} className="bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-xl">
                Scan Again
              </button>
            </div>
          )}

          {!loading && !error && filteredAlerts.length === 0 && (
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-16 text-center space-y-3 flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-400 text-xl">
                📭
              </div>
              <p className="text-xs text-slate-500 font-medium">No alerts found matching your selected filters.</p>
            </div>
          )}

          {!loading && !error && filteredAlerts.length > 0 && (
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-200 transition-all shadow-sm flex flex-col md:flex-row items-start gap-4"
                >
                  {/* Left Column Icon */}
                  <div className="w-11 h-11 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0 text-xl shadow-inner">
                    {getAlertIcon(alert.type)}
                  </div>

                  {/* Right Column Body */}
                  <div className="space-y-3 flex-grow">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 font-mono font-black text-[9px] px-2 py-0.5 rounded-full uppercase">
                          {getNiceTypeName(alert.type)}
                        </span>
                        {alert.companyName && (
                          <span className="text-[10px] text-slate-500 font-bold font-sans">
                            • {alert.companyName}
                          </span>
                        )}
                        <span className={`border px-2 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase shrink-0 ${getUrgencyStyles(alert.urgency)}`}>
                          {alert.urgency} Priority
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-800 tracking-tight leading-snug">
                        {alert.title}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      {alert.description}
                    </p>

                    {/* Footer Row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 mt-2">
                      <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider shrink-0 mr-1">Trending Skills:</span>
                        {alert.trendingSkills.map((s) => (
                          <span key={s} className="bg-slate-100 text-slate-700 border border-slate-200/50 rounded-lg px-2 py-0.5 text-[9px] font-mono font-bold">
                            {s}
                          </span>
                        ))}
                      </div>

                      {alert.source && (
                        <a
                          href={alert.source}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-all"
                        >
                          Details Source <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
