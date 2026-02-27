'use client';

import { useMemo, useEffect, useState } from 'react';
import { getEvolutionStage } from '@/lib/evolutionStages';

interface Props {
  totalXP: number;
  lastXPGained: number | null;
}

export default function AvatarDisplay({ totalXP, lastXPGained }: Props) {
  const stage = useMemo(() => getEvolutionStage(totalXP), [totalXP]);
  const [showXPGain, setShowXPGain] = useState(false);
  const [prevLevel, setPrevLevel] = useState(stage.level);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    if (lastXPGained !== null && lastXPGained > 0) {
      setShowXPGain(true);
      const t = setTimeout(() => setShowXPGain(false), 2500);
      return () => clearTimeout(t);
    }
  }, [lastXPGained]);

  useEffect(() => {
    if (stage.level > prevLevel) {
      setShowLevelUp(true);
      const t = setTimeout(() => setShowLevelUp(false), 3000);
      setPrevLevel(stage.level);
      return () => clearTimeout(t);
    }
    setPrevLevel(stage.level);
  }, [stage.level, prevLevel]);

  const shapeStyle: React.CSSProperties = {
    clipPath: stage.clipPath === 'none' ? undefined : stage.clipPath,
    borderRadius: stage.borderRadius ?? undefined,
  };

  return (
    <div className="flex flex-col items-center space-y-4 py-4">
      {/* Level up banner */}
      {showLevelUp && (
        <div className="w-full bg-yellow-500/20 border border-yellow-500/40 rounded-xl px-4 py-2 text-center">
          <p className="text-yellow-300 font-bold text-sm">✨ 進化！ → {stage.name}</p>
        </div>
      )}

      {/* Avatar container */}
      <div className="relative flex items-center justify-center w-52 h-52">
        {/* Outer glow */}
        <div
          className="absolute inset-0 rounded-full blur-3xl opacity-25"
          style={{ backgroundColor: stage.glowColor }}
        />
        {/* Mid glow */}
        <div
          className="absolute inset-4 rounded-full blur-xl opacity-20"
          style={{ backgroundColor: stage.glowColor }}
        />

        {/* Main avatar shape */}
        <div
          className={`w-36 h-36 ${stage.bgClass} ${stage.animClass}`}
          style={shapeStyle}
        />

        {/* XP gain float */}
        {showXPGain && lastXPGained !== null && (
          <div
            className="absolute top-2 right-2 text-base font-black text-violet-300 xp-float pointer-events-none"
          >
            +{lastXPGained} XP
          </div>
        )}
      </div>

      {/* Stage info */}
      <div className="text-center space-y-1">
        <div className="text-xs text-slate-500 uppercase tracking-widest">Lv.{stage.level}</div>
        <div className="text-2xl font-black" style={{ color: stage.textColor }}>
          {stage.name}
        </div>
        <div className="text-xs text-slate-400 max-w-[220px] leading-relaxed">
          {stage.description}
        </div>
      </div>

      {/* Total XP display */}
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-black text-slate-100">{totalXP.toLocaleString()}</span>
        <span className="text-sm text-slate-500">XP</span>
      </div>
    </div>
  );
}
