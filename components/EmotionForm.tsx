'use client';

import { useState, useMemo } from 'react';
import { calculateXP } from '@/lib/xpCalculator';

interface Props {
  onSubmit: (text: string) => void;
}

const HINT_KEYWORDS = ['辛い', '理不尽', '悔しい', '耐えた', '我慢', '頑張った', '先輩', '上司', '最悪', '乗り越えた'];

export default function EmotionForm({ onSubmit }: Props) {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const preview = useMemo(() => {
    if (!text.trim()) return null;
    return calculateXP(text);
  }, [text]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isSubmitting) return;
    setIsSubmitting(true);
    onSubmit(text);
    setText('');
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-slate-200 mb-1">今日の戦場報告</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          理不尽なこと・耐え抜いたことを書き出そう。<br />
          全部経験値（XP）に変換してやる。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/*
          font-size MUST be 16px or larger on iOS to prevent Safari from
          auto-zooming the viewport when the textarea receives focus.
          text-base = 1rem = 16px — the minimum safe value.
        */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="例：今日も先輩から理不尽な指摘を受けた。悔しかったけど耐えた。絶対に見返してやる..."
          className="w-full h-44 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 text-base resize-none focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 leading-relaxed"
        />

        {/* XP Preview */}
        {preview && preview.xp > 0 && (
          <div className="bg-slate-900/80 border border-violet-900/50 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">獲得予定XP</span>
              <span className="text-xl font-black text-violet-400">+{preview.xp} XP</span>
            </div>
            {preview.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {preview.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-xs bg-violet-900/40 text-violet-300 px-2 py-0.5 rounded-full border border-violet-700/40"
                  >
                    {kw} ⚡
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* min-h-[48px] ensures 48px minimum touch target (Apple HIG recommends ≥44pt) */}
        <button
          type="submit"
          disabled={!text.trim() || isSubmitting}
          className="w-full min-h-[48px] bg-violet-600 hover:bg-violet-500 active:bg-violet-700 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-base font-bold transition-all tracking-wide"
        >
          {isSubmitting ? '変換中...' : '⚡ XPに変換する'}
        </button>
      </form>

      {/* Keyword hints */}
      <div className="bg-slate-900/50 rounded-xl p-3 space-y-2">
        <p className="text-xs text-slate-500 font-medium">XP UPキーワード例:</p>
        <div className="flex flex-wrap gap-1.5">
          {HINT_KEYWORDS.map((kw) => (
            <span
              key={kw}
              className="text-xs text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/50"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
