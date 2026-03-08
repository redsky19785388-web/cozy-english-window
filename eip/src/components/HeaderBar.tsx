"use client";

import { AppState } from "@/app/page";

interface HeaderBarProps {
  appState: AppState;
}

const STATUS_MAP = {
  idle: { label: "STANDBY", color: "text-zinc-500", dot: "bg-zinc-600" },
  submitting: { label: "EVALUATING", color: "text-yellow-400", dot: "bg-yellow-400 animate-pulse" },
  evaluated: { label: "COMPLETE", color: "text-green-400", dot: "bg-green-500" },
};

export default function HeaderBar({ appState }: HeaderBarProps) {
  const status = STATUS_MAP[appState];

  return (
    <header className="border-b border-zinc-800 pb-4">
      {/* Top bar */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-zinc-600 text-xs tracking-[0.3em] uppercase mb-1">
            NERV // SPECIAL OPERATIONS DIVISION
          </div>
          <h1
            className="text-red-500 font-black leading-none"
            style={{
              fontFamily: "var(--font-serif-jp, 'Noto Serif JP', serif)",
              fontSize: "clamp(1.2rem, 4vw, 2rem)",
              textShadow: "0 0 20px rgba(192, 57, 43, 0.5)",
            }}
          >
            英語力補完計画
          </h1>
          <div className="text-zinc-500 text-xs tracking-widest mt-1">
            ENGLISH PROFICIENCY INSTRUMENTALITY PROJECT
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-2 justify-end">
            <div className={`w-2 h-2 rounded-full ${status.dot}`} />
            <span className={`text-xs tracking-widest ${status.color}`}>
              {status.label}
            </span>
          </div>
          <div className="text-zinc-700 text-xs mt-1">
            MAGI SYSTEM v3.0
          </div>
        </div>
      </div>

      {/* Decorative bar */}
      <div className="mt-3 flex gap-1">
        <div className="h-px flex-1 bg-red-800" />
        <div className="h-px w-4 bg-red-500" />
        <div className="h-px w-2 bg-orange-500" />
        <div className="h-px flex-1 bg-zinc-800" />
      </div>

      {/* Sub-info */}
      <div className="mt-2 flex gap-6 text-zinc-700 text-xs">
        <span>MAGI-1 MELCHIOR: ONLINE</span>
        <span className="text-zinc-800">|</span>
        <span>MAGI-2 BALTHASAR: ONLINE</span>
        <span className="text-zinc-800">|</span>
        <span>MAGI-3 CASPER: ONLINE</span>
      </div>
    </header>
  );
}
