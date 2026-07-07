import React, { useState } from "react";
import { Mail, CheckCircle2, ShieldCheck, RefreshCw, Send } from "lucide-react";

export default function EmailVerificationWidget() {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [code, setCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setIsLoading(true);

    // Simulate sending email verification code after a short delay
    setTimeout(() => {
      const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(mockCode);
      setIsSent(true);
      setIsLoading(false);
      // Log for diagnostic purposes in development console
      console.log(`[Mock Verification Code for ${email}]: ${mockCode}`);
    }, 1000);
  };

  const handleVerify = () => {
    setError("");
    if (code === generatedCode) {
      setIsVerified(true);
    } else {
      setError("Incorrect code. Please check the code and try again.");
    }
  };

  const handleReset = () => {
    setEmail("");
    setIsSent(false);
    setCode("");
    setGeneratedCode("");
    setIsVerified(false);
    setError("");
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors duration-300">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              Email ID Verification
              <span className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 normal-case font-sans">
                Optional
              </span>
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Verify your email ID optionally to link with career newsletters.</p>
          </div>
        </div>
        {isVerified && (
          <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold px-2.5 py-1 rounded-lg border border-emerald-150 dark:border-emerald-900/50 flex items-center gap-1 shrink-0 animate-fade-in">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Verified
          </span>
        )}
      </div>

      {!isVerified ? (
        <div className="space-y-3">
          {!isSent ? (
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your student email..."
                className="flex-1 bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 rounded-xl p-3 border border-slate-200 dark:border-slate-800 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 transition-all font-medium placeholder-slate-400"
              />
              <button
                type="button"
                onClick={handleSendCode}
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs px-4 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shrink-0 shadow-sm"
              >
                {isLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Send Code
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-3 animate-fade-in">
              <div className="p-2.5 bg-indigo-50/50 dark:bg-indigo-950/15 border border-indigo-100/50 dark:border-indigo-900/30 rounded-xl text-slate-600 dark:text-slate-300">
                <p className="text-[10px] font-medium leading-relaxed">
                  We have simulated sending a 6-digit verification code to <strong>{email}</strong>. 
                  <br />
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">Mock Code: {generatedCode}</span> (Use this code to verify)
                </p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6-digit code..."
                  className="flex-1 bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 text-center tracking-widest font-mono rounded-xl p-3 border border-slate-200 dark:border-slate-800 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 transition-all font-medium placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={handleVerify}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shrink-0 shadow-sm"
                >
                  Verify
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSent(false);
                    setCode("");
                  }}
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs px-3 rounded-xl transition-all cursor-pointer shrink-0 shadow-sm"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {error && (
            <p className="text-[10px] text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
              ⚠️ {error}
            </p>
          )}
        </div>
      ) : (
        <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/15 border border-emerald-100/50 dark:border-emerald-900/30 rounded-xl text-emerald-800 dark:text-emerald-300 animate-fade-in flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <div className="text-[10px] font-medium leading-relaxed">
              <strong>{email}</strong> is successfully verified. This is completely optional and doesn&apos;t restrict access to any evaluations or portals.
            </div>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer ml-3 whitespace-nowrap animate-fade-in"
          >
            Change Email
          </button>
        </div>
      )}
    </div>
  );
}
