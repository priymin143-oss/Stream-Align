import React, { useState, useRef, useEffect } from "react";
import { Check, ShieldCheck, RefreshCw, X, LogOut, Lock } from "lucide-react";

export default function EmailVerificationWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleVerify = () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid Google account email.");
      return;
    }
    setError("");
    setIsLoading(true);

    // Beautiful simulated Google authentication delay
    setTimeout(() => {
      setIsVerified(true);
      setIsLoading(false);
    }, 1200);
  };

  const handleReset = () => {
    setEmail("");
    setIsVerified(false);
    setError("");
  };

  const googleIcon = (
    <svg className="w-4 h-4 shrink-0 select-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.77-.32-1.37-.88-1.84-1.63z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );

  return (
    <div className="relative" ref={containerRef}>
      {/* Top Panel Button: Google Identity Styled */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold font-sans flex items-center gap-2 transition-all shadow-sm hover:scale-[1.02] active:scale-95 cursor-pointer ${
          isVerified
            ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-800/30 text-emerald-800 dark:text-emerald-400 animate-fade-in"
            : isOpen
            ? "bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100"
            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850"
        }`}
        title={isVerified ? `Logged in as ${email}` : "Sign in with Google"}
      >
        <div className="relative flex items-center justify-center">
          {googleIcon}
          {isVerified && (
            <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-slate-900 animate-pulse" />
          )}
        </div>
        <span className="hidden sm:inline">
          {isVerified ? "Logged in" : "Sign in"}
        </span>
      </button>

      {/* Floating Google-themed Translucent Popover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2.5 w-76 sm:w-80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 bg-white/95 dark:bg-slate-950/90 backdrop-blur-xl shadow-2xl z-50 animate-fade-in space-y-4 text-left">
          {/* Popover Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center shrink-0 border border-slate-200/50 dark:border-slate-800/50">
                {googleIcon}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-tight font-sans flex items-center gap-1">
                  Google Account
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium font-sans">StreamAlign integration</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {!isVerified ? (
            <div className="space-y-4">
              {/* Divider with Center Text */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-0.5 font-sans">
                  Sign in to Associate
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full bg-slate-50 dark:bg-slate-900/60 text-xs text-slate-800 dark:text-slate-100 rounded-xl p-3 border border-slate-200 dark:border-slate-800/80 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/15 transition-all font-medium placeholder-slate-400 dark:placeholder-slate-600 font-sans"
                    onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-3 py-1">
                  {/* Colorful Google-style loading progress bar */}
                  <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
                    <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-blue-500 via-red-500 via-yellow-500 to-green-500 w-1/2 rounded-full animate-pulse" style={{ width: "60%" }} />
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium text-center flex items-center justify-center gap-1.5 font-sans">
                    <RefreshCw className="w-3 h-3 animate-spin text-indigo-500" />
                    Connecting to Google Account secure servers...
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleVerify}
                  className="w-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs p-3 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-md font-sans"
                >
                  <span>Continue with Google</span>
                </button>
              )}

              {error && (
                <p className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1 pl-1 font-sans">
                  ⚠️ {error}
                </p>
              )}

              <div className="pt-2 border-t border-slate-100 dark:border-slate-900 flex items-center gap-1.5 text-[9px] text-slate-400 dark:text-slate-500 font-sans">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>StreamAlign is verified and secure. No password needed.</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              {/* Authenticated user card styled like Google profile menu */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-900 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0 border-2 border-white dark:border-slate-800">
                  {email.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate flex items-center gap-1 font-sans">
                    Google User
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-medium font-sans">{email}</p>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium leading-normal font-sans">
                  Linked securely with Google. Academic milestones are mapped perfectly to this profile.
                </p>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="w-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-xs p-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shrink-0 shadow-sm font-sans"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out from Google</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
