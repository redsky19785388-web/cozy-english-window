"use client";

import { MagiResult } from "@/app/page";

interface MagiPanelProps {
  result: MagiResult | null;
  rawStream: string;
  isLoading: boolean;
}

const PATTERN_STYLES = {
  PATTERN_BLUE: {
    border: "border-blue-700",
    bg: "bg-blue-950/20",
    text: "text-blue-400",
    glow: "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
    label: "PATTERN BLUE",
    scoreColor: "text-blue-400",
  },
  PATTERN_ORANGE: {
    border: "border-orange-700",
    bg: "bg-orange-950/20",
    text: "text-orange-400",
    glow: "shadow-[0_0_20px_rgba(234,88,12,0.3)]",
    label: "PATTERN ORANGE",
    scoreColor: "text-orange-400",
  },
  PATTERN_RED: {
    border: "border-red-700",
    bg: "bg-red-950/20",
    text: "text-red-400",
    glow: "shadow-[0_0_20px_rgba(220,38,38,0.4)]",
    label: "PATTERN RED",
    scoreColor: "text-red-400",
  },
};

const ERROR_TYPE_COLORS = {
  grammar: "text-yellow-400 border-yellow-700",
  vocabulary: "text-purple-400 border-purple-700",
  structure: "text-orange-400 border-orange-700",
};

export default function MagiPanel({ result, rawStream, isLoading }: MagiPanelProps) {
  const style = result ? PATTERN_STYLES[result.statusCode] : null;

  return (
    <div
      className={`
        border relative overflow-hidden animate-slide-in-up
        ${style ? `${style.border} ${style.glow}` : "border-zinc-800"}
      `}
    >
      {/* Top accent line */}
      <div
        className={`h-0.5 w-full ${style ? style.bg.replace("/20", "") : "bg-zinc-800"}`}
        style={{ background: style ? undefined : undefined }}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-2 h-2 rounded-full ${style ? style.text.replace("text", "bg") : "bg-zinc-600"}`} />
          <span className={`text-xs tracking-widest uppercase ${style ? style.text : "text-zinc-500"}`}>
            MAGI Evaluation System — {style ? style.label : "PROCESSING"}
          </span>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="space-y-3">
            <div className="text-zinc-500 text-xs tracking-widest">
              MAGI-1 MELCHIOR: ANALYZING<span className="animate-blink">_</span>
            </div>
            {rawStream && (
              <div className="bg-black/60 border border-zinc-800 p-3 max-h-32 overflow-y-auto">
                <div className="text-zinc-600 text-xs font-mono whitespace-pre-wrap break-all">
                  {rawStream.slice(-400)}
                  <span className="animate-blink">█</span>
                </div>
              </div>
            )}
            <div className="flex gap-1 mt-3">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="h-1 flex-1 bg-zinc-800 rounded-full"
                  style={{
                    animation: `pulse 1s ease-in-out infinite`,
                    animationDelay: `${i * 0.08}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        {result && style && (
          <div className="space-y-5 animate-slide-in-up">
            {/* Score banner */}
            <div className={`border ${style.border} ${style.bg} p-4 flex items-center justify-between`}>
              <div>
                <div className={`text-xs tracking-widest mb-1 ${style.text}`}>
                  SYNCHRONIZATION RATE
                </div>
                <div
                  className={`text-5xl font-black ${style.scoreColor}`}
                  style={{ fontFamily: "var(--font-serif-jp, serif)" }}
                >
                  {result.overallScore}
                  <span className="text-lg ml-1">pts</span>
                </div>
                <div className={`text-xs mt-1 ${style.text} opacity-70`}>
                  {result.statusLabel.toUpperCase()}
                </div>
              </div>

              {/* Score bar */}
              <div className="flex flex-col gap-1 w-24">
                {[...Array(10)].map((_, i) => {
                  const threshold = (10 - i) * 10;
                  return (
                    <div
                      key={i}
                      className={`h-2 rounded-sm transition-all duration-500 ${
                        result.overallScore >= threshold
                          ? style.bg.replace("/20", "/80")
                          : "bg-zinc-900"
                      }`}
                      style={{
                        background: result.overallScore >= threshold
                          ? undefined
                          : undefined,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Errors */}
            {result.errors.length > 0 && (
              <div>
                <div className="text-zinc-500 text-xs tracking-widest mb-2 uppercase">
                  // Anomaly Report ({result.errors.length} detected)
                </div>
                <div className="space-y-3">
                  {result.errors.map((err, i) => {
                    const errStyle = ERROR_TYPE_COLORS[err.type] || ERROR_TYPE_COLORS.grammar;
                    return (
                      <div
                        key={i}
                        className={`border-l-2 pl-3 py-1 ${errStyle.split(" ")[1]}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs uppercase tracking-wider ${errStyle.split(" ")[0]}`}>
                            [{err.type}]
                          </span>
                        </div>
                        <div className="text-red-400 text-xs line-through opacity-70 mb-0.5">
                          {err.original}
                        </div>
                        <div className="text-green-400 text-xs mb-1">
                          → {err.corrected}
                        </div>
                        <div className="text-zinc-500 text-xs">
                          {err.explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Strengths */}
            {result.strengths.length > 0 && (
              <div>
                <div className="text-zinc-500 text-xs tracking-widest mb-2 uppercase">
                  // Positive Assessment
                </div>
                <div className="space-y-1">
                  {result.strengths.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                      <span className="text-green-600 mt-0.5">▶</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Directive */}
            <div className={`border-t ${style.border} pt-4`}>
              <div className={`text-xs tracking-widest mb-2 ${style.text}`}>
                // MAGI DIRECTIVE //
              </div>
              <div
                className="text-zinc-300 text-sm leading-relaxed"
                style={{ fontFamily: "var(--font-serif-jp, serif)" }}
              >
                {result.directive}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
