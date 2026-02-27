'use client';

import { useMemo } from 'react';
import { getEvolutionStage, EVOLUTION_STAGES } from '@/lib/evolutionStages';

interface Props {
  totalXP: number;
}

export default function XPBar({ totalXP }: Props) {
  const stage = useMemo(() => getEvolutionStage(totalXP), [totalXP]);

  const isMaxLevel = stage.nextXP === Infinity;
  const progress = isMaxLevel
    ? 100
    : Math.min(100, ((totalXP - stage.minXP) / (stage.nextXP - stage.minXP)) * 100);
  const xpToNext = isMaxLevel ? 0 : stage.nextXP - totalXP;
  const nextStage = EVOLUTION_STAGES.find((s) => s.level === stage.level + 1);

  return (
    <div className="space-y-2 px-1 my-2">
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-400 font-medium">Lv.{stage.level}</span>
        {!isMaxLevel ? (
          <span className="text-slate-500">次のステージまで {xpToNext} XP</span>
        ) : (
          <span className="text-yellow-400 font-bold">MAX EVOLUTION 🦅</span>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${progress}%`,
            backgroundColor: stage.glowColor,
            boxShadow: `0 0 8px ${stage.glowColor}80`,
          }}
        />
      </div>

      {!isMaxLevel && nextStage && (
        <div className="flex justify-between text-xs text-slate-600">
          <span>
            {totalXP - stage.minXP} / {stage.nextXP - stage.minXP} XP
          </span>
          <span>次: {nextStage.name}</span>
        </div>
      )}

      {/* Stage dots */}
      <div className="flex justify-between px-1 mt-3">
        {EVOLUTION_STAGES.map((s) => (
          <div key={s.level} className="flex flex-col items-center gap-1">
            <div
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                totalXP >= s.minXP ? 'scale-125' : 'opacity-30'
              }`}
              style={{
                backgroundColor: totalXP >= s.minXP ? s.glowColor : '#374151',
                boxShadow: totalXP >= s.minXP ? `0 0 6px ${s.glowColor}` : 'none',
              }}
            />
            <span className="text-[9px] text-slate-600 text-center leading-tight max-w-[50px] truncate">
              {s.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
