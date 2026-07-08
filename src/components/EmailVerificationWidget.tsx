import React, { useState } from "react";
import { Mail, CheckCircle2, ShieldCheck, RefreshCw, ArrowRight } from "lucide-react";

export default function EmailVerificationWidget() {
  const [email, setEmail] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setIsLoading(true);

    // Instant/fast premium simulator for linking the email
    setTimeout(() => {
      setIsVerified(true);
      setIsLoading(false);
    }, 600);
  };

  const handleReset = () => {
    setEmail("");
    setIsVerified(false);
    setError("");
  };

  return (
    <div className="backdrop-blur-xl bg-white/40 dark:bg-slate-900/20 p-5 rounded-2xl border border-white/30 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] space-y-4 transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-white/40 dark:border-white/5 flex items-center justify-center text-slate-800 dark:text-slate-200 shadow-inner">
            <Mail className="w-4 h-4 text-indigo-650 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5 font-sans">
              Email Association
              <span className="text-[9px] font-bold bg-white/70 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full border border-white/30 dark:border-white/10 normal-case font-sans">
                Optional
              </span>
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Link your email address optionally to receive notifications.</p>
          </div>
        </div>
        {isVerified && (
          <span className="text-[10px] bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1 shrink-0 animate-fade-in">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Linked
          </span>
        )}
      </div>

      {!isVerified ? (
        <div className="space-y-2.5">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email ID..."
              className="flex-1 bg-white/70 dark:bg-slate-950/20 text-xs text-slate-800 dark:text-slate-100 rounded-xl p-3 border border-white/40 dark:border-white/10 focus:outline-none focus:bg-white/95 dark:focus:bg-slate-950/40 focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/25 transition-all font-medium placeholder-slate-400 dark:placeholder-slate-600"
            />
            <button
              type="button"
              onClick={handleVerify}
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-550 text-white font-bold text-xs px-4 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 hover:scale-[1.01] cursor-pointer shrink-0 shadow-sm border border-indigo-500/20"
            >
              {isLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <span>Link Email</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {error && (
            <p className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1 pl-1">
              ⚠️ {error}
            </p>
          )}
        </div>
      ) : (
        <div className="p-3.5 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 rounded-xl text-slate-700 dark:text-slate-300 animate-fade-in flex justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <p className="text-[10px] font-medium leading-relaxed">
              <strong>{email}</strong> has been associated. This is entirely optional and does not restrict your access to any evaluations or dashboards on the site.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer shrink-0"
          >
            Change
          </button>
        </div>
      )}
    </div>
  );
}
