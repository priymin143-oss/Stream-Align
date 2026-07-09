import React, { useState, useEffect, useRef } from "react";
import { auth, googleProvider, signInWithPopup, signOut } from "../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { Check, ShieldCheck, RefreshCw, LogOut, X } from "lucide-react";

export default function EmailVerificationWidget() {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-close dropdown on clicking outside
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    }, (err) => {
      console.error("Auth state change error:", err);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error("Google login error:", err);
      setError(err?.message || "Failed to sign in with Google.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsOpen(false);
    } catch (err: any) {
      console.error("Sign out error:", err);
    }
  };

  const googleIcon = (
    <svg className="w-4 h-4 shrink-0 select-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.77-.32-1.37-.88-1.84-1.63z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );

  if (isLoading) {
    return (
      <div className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 text-xs text-slate-500 flex items-center gap-2">
        <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500" />
        <span className="hidden sm:inline">Loading...</span>
      </div>
    );
  }

  // If not logged in, clicking the button immediately launches Google signInWithPopup
  if (!user) {
    return (
      <div className="relative" ref={containerRef}>
        <button
          type="button"
          onClick={handleSignIn}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold font-sans text-slate-700 dark:text-slate-300 flex items-center gap-2 transition-all shadow-sm hover:scale-[1.02] active:scale-95 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer"
          title="Sign in with Google"
        >
          {googleIcon}
          <span>Log In</span>
        </button>
        {error && (
          <div className="absolute right-0 top-full mt-2 bg-rose-600 text-white text-[10px] p-2 rounded shadow-lg z-50 font-sans">
            {error}
          </div>
        )}
      </div>
    );
  }

  // If logged in, click to toggle the settings/profile menu
  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold font-sans flex items-center gap-2 transition-all shadow-sm hover:scale-[1.02] active:scale-95 cursor-pointer ${
          isOpen
            ? "bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100"
            : "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-800/30 text-emerald-800 dark:text-emerald-400"
        }`}
        title={`Logged in as ${user.email}`}
      >
        <div className="relative flex items-center justify-center">
          {user.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-4 h-4 rounded-full" referrerPolicy="no-referrer" />
          ) : (
            googleIcon
          )}
          <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-slate-900 animate-pulse" />
        </div>
        <span className="hidden sm:inline">
          {user.displayName || "Logged In"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2.5 w-76 sm:w-80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 bg-white/95 dark:bg-slate-950/90 backdrop-blur-xl shadow-2xl z-50 animate-fade-in space-y-4 text-left">
          {/* Popover Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center shrink-0 border border-slate-200/50 dark:border-slate-800/50 overflow-hidden">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  googleIcon
                )}
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

          <div className="space-y-4 animate-fade-in">
            {/* Profile Detail */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0 border-2 border-white dark:border-slate-800 overflow-hidden">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  user.email?.charAt(0).toUpperCase()
                )}
              </div>
              <div className="overflow-hidden min-w-0">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate flex items-center gap-1 font-sans">
                  {user.displayName || "Google User"}
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-medium font-sans">{user.email}</p>
              </div>
            </div>

            <div className="p-2.5 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium leading-normal font-sans">
                Logged in successfully. Academic milestones are mapped perfectly to this profile.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="w-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-xs p-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shrink-0 shadow-sm font-sans"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
