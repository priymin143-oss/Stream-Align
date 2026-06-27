import React, { useState } from "react";
import { Plus, X, Sparkles } from "lucide-react";
import { COMMON_HOBBIES } from "../data/mockData";

interface HobbyInterestInputProps {
  selectedHobbies: string[];
  onAddHobby: (hobby: string) => void;
  onRemoveHobby: (hobby: string) => void;
}

export default function HobbyInterestInput({
  selectedHobbies,
  onAddHobby,
  onRemoveHobby,
}: HobbyInterestInputProps) {
  const [customHobby, setCustomHobby] = useState("");

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const hobby = customHobby.trim();
    if (hobby && !selectedHobbies.includes(hobby)) {
      onAddHobby(hobby);
      setCustomHobby("");
    }
  };

  const handlePresetClick = (preset: string) => {
    if (selectedHobbies.includes(preset)) {
      onRemoveHobby(preset);
    } else {
      onAddHobby(preset);
    }
  };

  return (
    <div id="hobby-interest-input-card" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          Hobby & Personal Interests
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Select or add the student's primary hobbies to map their native talents, curiosity, and creative inclinations.
        </p>
      </div>

      {/* Selected Hobbies display */}
      <div className="min-h-12 flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80 mb-4">
        {selectedHobbies.length === 0 ? (
          <span className="text-xs text-slate-400 italic flex items-center justify-center w-full self-center">
            No hobbies added yet. Choose from suggestions below or write your own.
          </span>
        ) : (
          selectedHobbies.map((hobby) => (
            <span
              key={hobby}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-full transition-all hover:border-amber-400 shadow-sm"
            >
              {hobby}
              <button
                type="button"
                onClick={() => onRemoveHobby(hobby)}
                className="hover:bg-amber-200 hover:text-amber-900 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))
        )}
      </div>

      {/* Custom input */}
      <form onSubmit={handleAddCustom} className="flex gap-2 mb-6">
        <input
          type="text"
          value={customHobby}
          onChange={(e) => setCustomHobby(e.target.value)}
          placeholder="Type a custom hobby... (e.g. Bio-mimicry)"
          className="flex-1 bg-slate-50 text-xs text-slate-800 rounded-xl p-3 border border-slate-200 focus:outline-none focus:bg-white focus:border-amber-500/50 transition-all placeholder-slate-400 font-medium"
        />
        <button
          type="submit"
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </form>

      {/* Preset Suggestions */}
      <div>
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
          Suggested Interests & Hobbies
        </h4>
        <div className="flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto pr-1">
          {COMMON_HOBBIES.map((preset) => {
            const isSelected = selectedHobbies.includes(preset);
            return (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${
                  isSelected
                    ? "bg-amber-50 text-amber-800 border-amber-300"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80"
                }`}
              >
                {isSelected ? "✓ " : ""}
                {preset}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
