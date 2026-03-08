"use client";

import { useRef } from "react";
import { ClassmateData, MissionType } from "@/app/page";

interface ClassmatePanelProps {
  data: ClassmateData | null;
  isLoading: boolean;
  userMissionType: MissionType;
}

const NAMES = ["Pilot-02", "Pilot-04", "Pilot-05", "Pilot-00", "Pilot-06"];

const MISSION_COLOR_MAP: Record<string, string> = {
  Summary: "text-blue-400 border-blue-800",
  Analysis: "text-purple-400 border-purple-800",
  Diary: "text-green-400 border-green-800",
  "Free Entry": "text-zinc-400 border-zinc-700",
};

export default function ClassmatePanel({
  data,
  isLoading,
}: ClassmatePanelProps) {
  // Stable random name per mount
  const nameRef = useRef(NAMES[Math.floor(Math.random() * NAMES.length)] ?? "Pilot-02");
  const name = nameRef.current;

  const missionColors = data
    ? (MISSION_COLOR_MAP[data.submission.missionType] ?? "text-zinc-400 border-zinc-700")
    : "";

  return (
    <div className="border border-zinc-800 relative overflow-hidden animate-slide-in-up">
      {/* Left accent stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-700 via-orange-800 to-transparent" />

      <div className="p-5 pl-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 bg-orange-500 rounded-full" />
          <span className="text-orange-400 text-xs tracking-widest uppercase">
            Boundary Zone — Classmate Interface
          </span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        {isLoading && !data && <LoadingState />}

        {data && (
          <div className="space-y-5 animate-slide-in-up">
            {/* Classmate identity */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-orange-800 bg-orange-950/30 flex items-center justify-center">
                <span className="text-orange-400 text-xs font-bold">AI</span>
              </div>
              <div>
                <div className="text-orange-300 text-sm font-bold tracking-wide">
                  {name}
                </div>
                <div className="text-zinc-600 text-xs">
                  Synchronization Level: SAME TIER
                </div>
              </div>
              <div className="ml-auto text-zinc-700 text-xs">
                Just submitted
              </div>
            </div>

            {/* Their submission */}
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-zinc-500 text-xs tracking-widest uppercase">
                  // Their Submission
                </span>
                <span className={`text-xs px-2 py-0.5 border ${missionColors}`}>
                  {data.submission.missionType}
                </span>
                {data.submission.topic && (
                  <span className="text-zinc-600 text-xs">
                    — {data.submission.topic}
                  </span>
                )}
              </div>

              <div className="bg-black/40 border border-zinc-800 p-4">
                <div className="text-zinc-300 text-sm leading-relaxed">
                  {data.submission.text}
                </div>
              </div>
            </div>

            {/* Their monologue */}
            <div>
              <div className="text-zinc-500 text-xs tracking-widest mb-2 uppercase">
                // Internal Monologue
              </div>

              <div className="border-l-2 border-orange-800 pl-4 py-2 bg-orange-950/10">
                <div
                  className="text-orange-200/80 text-sm leading-relaxed italic"
                  style={{ fontFamily: "var(--font-serif-jp)" }}
                >
                  {data.monologue}
                </div>
              </div>

              {/* Emotional gauge */}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-zinc-700 text-xs whitespace-nowrap">EMOTIONAL INDEX</span>
                <div className="flex gap-0.5 flex-1">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-sm ${i < 14 ? "bg-orange-700" : "bg-zinc-800"}`}
                    />
                  ))}
                </div>
                <span className="text-orange-400 text-xs">70%</span>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-zinc-900 pt-3">
              <div className="text-zinc-700 text-xs text-center tracking-wide">
                同調率が近い ― You are not alone in this battle.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="text-zinc-500 text-xs tracking-widest">
        CONNECTING TO BOUNDARY ZONE<span className="animate-blink">_</span>
      </div>
      <div className="space-y-2">
        {[80, 60, 90, 40].map((w, i) => (
          <div key={i} className="flex gap-2 items-center">
            <div className="h-px bg-zinc-800 flex-1" />
            <div
              className="h-3 bg-orange-900/40 border border-orange-900/60 rounded-sm animate-pulse"
              style={{ width: `${w}%`, animationDelay: `${i * 0.2}s` }}
            />
          </div>
        ))}
      </div>
      <div className="text-zinc-700 text-xs">
        Awaiting classmate synchronization...
      </div>
    </div>
  );
}
