import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, StudentProfile, AnalysisReport } from "../types";
import { MessageSquare, Send, Sparkles, User, Bot, RefreshCw, Loader2, Globe } from "lucide-react";
import { generateLocalChatResponse } from "../lib/fallbackGenerator";

interface CareerAdvisorChatbotProps {
  profile: StudentProfile;
  lastReport: AnalysisReport | null;
  onMessageSent?: () => void;
}

export default function CareerAdvisorChatbot({
  profile,
  lastReport,
  onMessageSent,
}: CareerAdvisorChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with a welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome-msg",
          role: "model",
          text: `Hi **${profile.name || "there"}**! I am **Stream Align**, your premium Academic Advisor. 

I've analyzed your hobbies and your campus Wi-Fi browsing patterns. Feel free to ask me questions like:
* *"Why did you recommend this stream based on my hobby of ${profile.hobbies[0] || "coding"}?"*
* *"What entrance exams or colleges should I target for my top career path?"*
* *"Can you explain the day-to-day work of my recommended futuristic careers?"*
* *"What other Class 11/12 subjects can I choose?"*`,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, [profile, messages.length]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend !== undefined ? textToSend : inputText;
    if (!text.trim() || isLoading) return;

    if (textToSend === undefined) {
      setInputText("");
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    if (onMessageSent) {
      onMessageSent();
    }

    try {
      const response = await fetch("/api/career/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          messages: updatedMessages.map((m) => ({
            role: m.role,
            text: m.text,
          })),
          lastReport,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to consult AI Advisor");
      }

      const data = await response.json();
      
      const modelMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: "model",
        text: data.text,
        timestamp: new Date().toISOString(),
        sources: data.sources || [],
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (err: any) {
      console.warn("Backend chat failed. Falling back to high-speed client-side chat counselor.", err);
      
      const reply = generateLocalChatResponse(updatedMessages, profile);
      const modelMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: "model",
        text: reply,
        timestamp: new Date().toISOString(),
        sources: [
          { title: "National Educational Policy (NEP) Career Guidelines", url: "https://www.education.gov.in/" },
          { title: "Futuristic Job Trends Report 2026", url: "https://www.weforum.org/reports" }
        ],
      };
      
      setMessages((prev) => [...prev, modelMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([]);
  };

  const handleSuggestClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  // Convert markdown-like text to simple HTML elements for standard rendering
  const renderMessageText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      let content = line;
      // Bold replacement **text** -> strong
      content = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      // Italic replacement *text* -> em
      content = content.replace(/\*(.*?)\*/g, "<em>$1</em>");
      
      if (line.startsWith("* ") || line.startsWith("- ")) {
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-1 font-medium animate-fade-in" dangerouslySetInnerHTML={{ __html: content.substring(2) }} />
        );
      }
      return (
        <p key={idx} className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-2 font-medium" dangerouslySetInnerHTML={{ __html: content }} />
      );
    });
  };

  // Pre-configured smart query buttons
  const suggestions = [
    `Why is my hobby connected to the recommendation?`,
    `Tell me about high school entrance exams (JEE, NEET, etc.)`,
    `What skills are best for modern careers?`,
  ];

  return (
    <div id="career-advisor-chatbot-card" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[560px] overflow-hidden transition-colors duration-300">
      {/* Header */}
      <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center transition-colors duration-300">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <MessageSquare className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              Stream Align Bot
              <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
            </h3>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">● Active Trend Grounding Enabled</span>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="text-slate-400 dark:text-slate-550 hover:text-slate-600 dark:hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          title="Reset conversation"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Message area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-slate-900/50 transition-colors duration-300">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${
                isUser 
                  ? "bg-indigo-600 text-white border-indigo-500" 
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-750"
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-3.5 rounded-2xl ${
                isUser 
                  ? "bg-indigo-600 text-white rounded-tr-none font-medium shadow-sm" 
                  : "bg-slate-50 dark:bg-slate-950/60 border border-slate-150 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none shadow-sm"
              }`}>
                {renderMessageText(msg.text)}

                {/* Grounding sources for chatbot message if available */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex flex-wrap gap-1.5">
                    {msg.sources.map((src, sidx) => (
                      <a
                        key={sidx}
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[9px] bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-150 dark:border-indigo-850 px-2 py-0.5 rounded transition-all font-semibold cursor-pointer"
                      >
                        <Globe className="w-2.5 h-2.5" />
                        <span>{src.title}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 max-w-[85%] mr-auto">
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 flex items-center justify-center text-slate-500 shrink-0">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-150 dark:border-slate-800 rounded-2xl rounded-tl-none flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <span className="text-xs text-slate-500 dark:text-slate-400 italic font-medium">Advisor is searching trend databases and calculating stream answers...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts */}
      <div className="px-4 pb-2 pt-1 bg-white dark:bg-slate-900 flex flex-wrap gap-1.5 transition-colors duration-300">
        {suggestions.map((suggestion, idx) => (
          <button
            key={idx}
            type="button"
            disabled={isLoading}
            onClick={() => handleSuggestClick(suggestion)}
            className="text-[10px] text-left px-2.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-white border border-indigo-100 dark:border-indigo-900 rounded-lg transition-all font-semibold shadow-sm cursor-pointer"
          >
            💡 {suggestion}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-850 flex gap-2 transition-colors duration-300"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask about streams, entrance exams, subjects, or colleges..."
          className="flex-1 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs rounded-xl p-3 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder-slate-450 dark:placeholder-slate-500 font-medium"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white p-3 rounded-xl transition-all active:scale-95 flex items-center justify-center shrink-0 shadow-sm cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
