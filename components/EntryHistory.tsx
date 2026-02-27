'use client';

import { Entry } from '@/lib/types';

interface Props {
  entries: Entry[];
  onReset: () => void;
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'たった今';
  if (diffMins < 60) return `${diffMins}分前`;
  if (diffHours < 24) return `${diffHours}時間前`;
  if (diffDays === 1) return '昨日';
  return `${diffDays}日前`;
}

export default function EntryHistory({ entries, onReset }: Props) {
  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-400">
          戦場記録 ({entries.length}件)
        </h3>
        {entries.length > 0 && (
          <button
            onClick={onReset}
            className="text-xs text-slate-600 hover:text-red-400 transition-colors px-2 py-1 rounded"
          >
            リセット
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-10 text-slate-600 text-sm space-y-2">
          <div className="text-3xl">🌑</div>
          <p>まだ記録がありません。</p>
          <p className="text-xs">戦場からの最初の報告を待っています。</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.slice(0, 10).map((entry) => (
            <div
              key={entry.id}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs text-slate-400 flex-1 leading-relaxed line-clamp-2">
                  {entry.text}
                </p>
                <span className="text-sm font-black text-violet-400 shrink-0 tabular-nums">
                  +{entry.xpGained}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-600">{formatTime(entry.timestamp)}</span>
                {entry.keywords.slice(0, 4).map((kw) => (
                  <span
                    key={kw}
                    className="text-[10px] text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700/50"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {entries.length > 10 && (
            <p className="text-xs text-slate-600 text-center py-2">
              他 {entries.length - 10} 件の記録
            </p>
          )}
        </div>
      )}
    </div>
  );
}
