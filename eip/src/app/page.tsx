"use client";

import { useState, useRef, useCallback } from "react";
import FlashOverlay from "@/components/FlashOverlay";
import HeaderBar from "@/components/HeaderBar";
import EntryPlug from "@/components/EntryPlug";
import MagiPanel from "@/components/MagiPanel";
import ClassmatePanel from "@/components/ClassmatePanel";

export type MissionType = "Summary" | "Analysis" | "Diary" | "Free Entry";

export interface MagiError {
  type: "grammar" | "vocabulary" | "structure";
  original: string;
  corrected: string;
  explanation: string;
}

export interface MagiResult {
  statusCode: "PATTERN_BLUE" | "PATTERN_ORANGE" | "PATTERN_RED";
  statusLabel: string;
  overallScore: number;
  errors: MagiError[];
  strengths: string[];
  directive: string;
}

export interface ClassmateData {
  submission: {
    missionType: string;
    text: string;
    topic: string;
  };
  monologue: string;
}

export type AppState = "idle" | "submitting" | "evaluated";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [inputText, setInputText] = useState("");
  const [missionType, setMissionType] = useState<MissionType>("Summary");
  const [magiResult, setMagiResult] = useState<MagiResult | null>(null);
  const [classmateData, setClassmateData] = useState<ClassmateData | null>(null);
  const [magiRawStream, setMagiRawStream] = useState("");
  const [flashActive, setFlashActive] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submitLocked = useRef(false);

  const triggerFlash = useCallback((message: string) => {
    setFlashMessage(message);
    setFlashActive(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFlashActive(true);
      });
    });
    setTimeout(() => setFlashActive(false), 1400);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (submitLocked.current || !inputText.trim()) return;
    submitLocked.current = true;
    setError(null);
    setAppState("submitting");
    setMagiResult(null);
    setClassmateData(null);
    setMagiRawStream("");

    triggerFlash("作戦開始 — INITIATING EVALUATION");

    try {
      const [magiRes, classRes] = await Promise.allSettled([
        fetchMagiEvaluation(inputText, missionType, setMagiRawStream),
        fetchClassmateData(inputText, missionType),
      ]);

      if (magiRes.status === "fulfilled") {
        setMagiResult(magiRes.value);
        const code = magiRes.value.statusCode;
        const msg =
          code === "PATTERN_BLUE"
            ? "添削完了 — PATTERN BLUE"
            : code === "PATTERN_ORANGE"
            ? "警告 — PATTERN ORANGE"
            : "臨界警報 — PATTERN RED";
        triggerFlash(msg);
      } else {
        setError("MAGI評価システム — CONNECTION LOST");
      }

      if (classRes.status === "fulfilled") {
        setClassmateData(classRes.value);
      }

      setAppState("evaluated");
    } catch (err) {
      console.error(err);
      setError("システムエラー — CRITICAL FAILURE");
      setAppState("idle");
    } finally {
      submitLocked.current = false;
    }
  }, [inputText, missionType, triggerFlash]);

  const handleReset = useCallback(() => {
    setAppState("idle");
    setMagiResult(null);
    setClassmateData(null);
    setMagiRawStream("");
    setError(null);
    setInputText("");
    triggerFlash("システムリセット — SYSTEM RESET");
  }, [triggerFlash]);

  return (
    <main className="min-h-screen bg-black font-[family-name:var(--font-mono)]">
      <FlashOverlay active={flashActive} message={flashMessage} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <HeaderBar appState={appState} />

        <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left: Entry + MAGI */}
          <div className="flex flex-col gap-6">
            <EntryPlug
              inputText={inputText}
              setInputText={setInputText}
              missionType={missionType}
              setMissionType={setMissionType}
              appState={appState}
              onSubmit={handleSubmit}
              onReset={handleReset}
            />

            {(appState === "submitting" || magiResult) && (
              <MagiPanel
                result={magiResult}
                rawStream={magiRawStream}
                isLoading={appState === "submitting" && !magiResult}
              />
            )}

            {error && (
              <div className="border border-red-800 bg-red-950/20 p-4 text-red-400 text-xs">
                <span className="text-red-500 font-bold">// SYSTEM ERROR //</span>
                <br />
                {error}
              </div>
            )}
          </div>

          {/* Right: Classmate */}
          <div className="flex flex-col gap-6">
            {(appState === "submitting" || appState === "evaluated") ? (
              <ClassmatePanel
                data={classmateData}
                isLoading={appState === "submitting" && !classmateData}
                userMissionType={missionType}
              />
            ) : (
              <StandbyPanel />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function StandbyPanel() {
  return (
    <div className="border border-zinc-800 bg-zinc-950/30 p-8 text-center relative overflow-hidden min-h-80 flex flex-col items-center justify-center">
      {/* Corner decorations */}
      <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-zinc-700" />
      <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-zinc-700" />

      <div className="text-zinc-700 text-xs tracking-widest mb-8 uppercase">
        MAGI SYSTEM — STANDBY MODE
      </div>

      <div
        className="text-zinc-600 text-5xl font-black leading-tight select-none"
        style={{ fontFamily: "var(--font-serif-jp, 'Noto Serif JP', serif)" }}
      >
        逃げちゃ
        <br />
        ダメだ
      </div>

      <div className="mt-2 text-zinc-700 text-4xl font-black select-none"
        style={{ fontFamily: "var(--font-serif-jp, 'Noto Serif JP', serif)" }}>
        逃げちゃダメだ
      </div>

      <div className="mt-8 text-zinc-700 text-xs tracking-widest">
        AWAIT PILOT INPUT<span className="animate-blink ml-1">_</span>
      </div>

      <div className="mt-8 grid grid-cols-8 gap-1 opacity-10">
        {Array.from({ length: 32 }).map((_, i) => (
          <div key={i} className="w-3 h-3 border border-zinc-600" />
        ))}
      </div>
    </div>
  );
}

// ─── Data fetching ─────────────────────────────────────────────────────────

async function fetchMagiEvaluation(
  text: string,
  missionType: string,
  onChunk: (raw: string) => void
): Promise<MagiResult> {
  const res = await fetch("/api/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, missionType }),
  });

  if (!res.ok || !res.body) throw new Error(`MAGI API error: ${res.status}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let accumulated = "";
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    accumulated += decoder.decode(value, { stream: true });

    const lines = accumulated.split("\n");
    accumulated = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const payload = JSON.parse(line.slice(6));
      if (payload.chunk) {
        fullText += payload.chunk;
        onChunk(fullText);
      }
      if (payload.done && payload.fullText) fullText = payload.fullText;
      if (payload.error) throw new Error(payload.error);
    }
  }

  const jsonMatch = fullText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("MAGI returned invalid data");
  return JSON.parse(jsonMatch[0]) as MagiResult;
}

async function fetchClassmateData(
  userText: string,
  missionType: string
): Promise<ClassmateData> {
  const res = await fetch("/api/classmate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userText, missionType }),
  });
  if (!res.ok) throw new Error(`Classmate API error: ${res.status}`);
  return res.json();
}
