'use client';

import { useState, useEffect, useCallback } from 'react';
import { loadState, addEntry, resetState } from '@/lib/storage';
import { calculateXP } from '@/lib/xpCalculator';
import { AppState, Entry } from '@/lib/types';
import EmotionForm from '@/components/EmotionForm';
import AvatarDisplay from '@/components/AvatarDisplay';
import XPBar from '@/components/XPBar';
import EntryHistory from '@/components/EntryHistory';

type Tab = 'input' | 'avatar';

export default function Home() {
  const [state, setState] = useState<AppState>({ totalXP: 0, entries: [] });
  const [activeTab, setActiveTab] = useState<Tab>('input');
  const [lastXPGained, setLastXPGained] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setState(loadState());
    setIsLoaded(true);
  }, []);

  const handleSubmit = useCallback(
    (text: string) => {
      const { xp, keywords } = calculateXP(text);
      const entry: Entry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        text,
        xpGained: xp,
        timestamp: Date.now(),
        keywords,
      };
      setState((prev) => addEntry(prev, entry));
      setLastXPGained(xp);
      setActiveTab('avatar');
      setTimeout(() => setLastXPGained(null), 3000);
    },
    []
  );

  const handleReset = useCallback(() => {
    if (window.confirm('本当にリセットしますか？全てのXPと記録が消えます。')) {
      setState(resetState());
    }
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-600 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <header className="px-4 pt-safe pt-6 pb-2">
        <div className="flex items-baseline justify-between">
          <div>
            <h1 className="text-xl font-black text-violet-400 tracking-tight">ダメージXP</h1>
            <p className="text-xs text-slate-600 mt-0.5">苦難を経験値に変換する</p>
          </div>
          <div className="text-right">
            <span className="text-lg font-black text-slate-300 tabular-nums">
              {state.totalXP.toLocaleString()}
            </span>
            <span className="text-xs text-slate-600 ml-1">XP</span>
          </div>
        </div>
      </header>

      {/* Tab navigation */}
      <nav className="flex border-b border-slate-800/80 px-4 mt-2">
        <button
          className={`py-3 px-1 mr-6 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'input'
              ? 'text-violet-400 border-violet-400'
              : 'text-slate-500 border-transparent hover:text-slate-400'
          }`}
          onClick={() => setActiveTab('input')}
        >
          戦利品回収
        </button>
        <button
          className={`py-3 px-1 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'avatar'
              ? 'text-violet-400 border-violet-400'
              : 'text-slate-500 border-transparent hover:text-slate-400'
          }`}
          onClick={() => setActiveTab('avatar')}
        >
          メタモルフォーゼ
          {lastXPGained !== null && activeTab !== 'avatar' && (
            <span className="ml-1.5 inline-block w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
          )}
        </button>
      </nav>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-5 pb-safe pb-8">
        {activeTab === 'input' ? (
          <EmotionForm onSubmit={handleSubmit} />
        ) : (
          <div>
            <AvatarDisplay totalXP={state.totalXP} lastXPGained={lastXPGained} />
            <div className="px-1">
              <XPBar totalXP={state.totalXP} />
            </div>
            <EntryHistory entries={state.entries} onReset={handleReset} />
          </div>
        )}
      </div>
    </main>
  );
}
