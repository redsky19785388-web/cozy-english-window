"use client";

import { AppState, MissionType } from "@/app/page";

const MISSION_TYPES: MissionType[] = ["Summary", "Analysis", "Diary", "Free Entry"];

const MISSION_LABELS: Record<MissionType, { ja: string; description: string; color: string }> = {
  Summary: {
    ja: "要約",
    description: "Summarize content you consumed today",
    color: "border-blue-700 text-blue-400",
  },
  Analysis: {
    ja: "考察",
    description: "Analyze and interpret meaning or implications",
    color: "border-purple-700 text-purple-400",
  },
  Diary: {
    ja: "日記",
    description: "Record your learning experience today",
    color: "border-green-700 text-green-400",
  },
  "Free Entry": {
    ja: "自由",
    description: "Write freely — no constraints",
    color: "border-zinc-600 text-zinc-400",
  },
};

interface EntryPlugProps {
  inputText: string;
  setInputText: (v: string) => void;
  missionType: MissionType;
  setMissionType: (v: MissionType) => void;
  appState: AppState;
  onSubmit: () => void;
  onReset: () => void;
}

export default function EntryPlug({
  inputText,
  setInputText,
  missionType,
  setMissionType,
  appState,
  onSubmit,
  onReset,
}: EntryPlugProps) {
  const isSubmitting = appState === "submitting";
  const isEvaluated = appState === "evaluated";
  const charCount = inputText.length;
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const missionInfo = MISSION_LABELS[missionType];

  return (
    <div className="border border-zinc-800 bg-zinc-950/40 relative">
      {/* Corner decorations */}
      <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-red-700" />
      <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-red-700" />
      <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-zinc-700" />
      <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-zinc-700" />

      <div className="p-5">
        {/* Panel header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 bg-red-500 rounded-full" />
          <span className="text-red-400 text-xs tracking-widest uppercase">
            Entry Plug — Pilot Interface
          </span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        {/* Mission type selector */}
        <div className="mb-4">
          <div className="text-zinc-600 text-xs tracking-widest mb-2">
            【作戦目標 — MISSION TYPE】
          </div>
          <div className="grid grid-cols-4 gap-1">
            {MISSION_TYPES.map((type) => {
              const info = MISSION_LABELS[type];
              const isSelected = missionType === type;
              return (
                <button
                  key={type}
                  onClick={() => !isSubmitting && setMissionType(type)}
                  disabled={isSubmitting || isEvaluated}
                  className={`
                    border px-2 py-2 text-xs transition-all duration-150
                    ${isSelected
                      ? `${info.color} bg-zinc-900`
                      : "border-zinc-800 text-zinc-600 hover:border-zinc-600 hover:text-zinc-400"
                    }
                    disabled:opacity-40 disabled:cursor-not-allowed
                  `}
                >
                  <div className="font-bold"
                    style={{ fontFamily: "var(--font-serif-jp, serif)" }}>
                    {info.ja}
                  </div>
                  <div className="text-[10px] opacity-70 mt-0.5">{type}</div>
                </button>
              );
            })}
          </div>
          {missionType && (
            <div className="text-zinc-700 text-xs mt-1 tracking-wide">
              → {missionInfo.description}
            </div>
          )}
        </div>

        {/* Text area */}
        <div className="mb-3">
          <div className="text-zinc-600 text-xs tracking-widest mb-2">
            【自由記述 — FREE ENTRY ZONE】
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isSubmitting || isEvaluated}
            placeholder={
              isEvaluated
                ? "// EVALUATION COMPLETE — RESET TO CONTINUE //"
                : "Enter your English text here...\n\nExample: 'Today I watched a BBC report about climate change. The presenter explained that global temperatures have risen significantly...'"
            }
            className={`
              w-full h-48 bg-black border text-sm p-3
              text-zinc-300 placeholder:text-zinc-700
              focus:outline-none focus:border-red-700
              transition-colors duration-200
              ${isSubmitting || isEvaluated
                ? "border-zinc-800 opacity-50 cursor-not-allowed"
                : "border-zinc-700 hover:border-zinc-600"
              }
            `}
          />
          {/* Stats */}
          <div className="flex justify-between text-zinc-700 text-xs mt-1">
            <span>{wordCount} words</span>
            <span>{charCount} chars</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          {!isEvaluated ? (
            <button
              onClick={onSubmit}
              disabled={isSubmitting || !inputText.trim()}
              className={`
                flex-1 py-3 text-sm font-bold tracking-widest uppercase transition-all duration-200
                ${isSubmitting
                  ? "bg-zinc-900 border border-zinc-700 text-zinc-500 cursor-not-allowed"
                  : !inputText.trim()
                  ? "bg-zinc-900 border border-zinc-800 text-zinc-700 cursor-not-allowed"
                  : "bg-red-900 border border-red-700 text-red-200 hover:bg-red-800 hover:border-red-500 hover:text-white cursor-pointer"
                }
              `}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin inline-block w-3 h-3 border border-zinc-500 border-t-zinc-300 rounded-full" />
                  EVALUATING...
                </span>
              ) : (
                "【提出】SUBMIT ENTRY"
              )}
            </button>
          ) : (
            <button
              onClick={onReset}
              className="flex-1 py-3 text-sm font-bold tracking-widest uppercase bg-zinc-900 border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white transition-all duration-200 cursor-pointer"
            >
              【再起動】NEW MISSION
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
