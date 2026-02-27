import { EvolutionStage } from './types';

export const EVOLUTION_STAGES: EvolutionStage[] = [
  {
    level: 1,
    name: '灰色の卵',
    minXP: 0,
    nextXP: 100,
    glowColor: '#6b7280',
    textColor: '#9ca3af',
    bgClass: 'bg-gradient-to-br from-gray-500 to-gray-700',
    animClass: 'avatar-egg',
    clipPath: 'none',
    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
    description: '傷を受け止め、静かに耐えている...',
  },
  {
    level: 2,
    name: '氷の耐性シールド',
    minXP: 100,
    nextXP: 300,
    glowColor: '#67e8f9',
    textColor: '#a5f3fc',
    bgClass: 'bg-gradient-to-br from-cyan-400 to-blue-600',
    animClass: 'avatar-ice',
    clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
    description: '冷静な防御壁が形成されつつある...',
  },
  {
    level: 3,
    name: '反骨の炎',
    minXP: 300,
    nextXP: 600,
    glowColor: '#f97316',
    textColor: '#fdba74',
    bgClass: 'bg-gradient-to-br from-orange-400 to-red-600',
    animClass: 'avatar-flame',
    clipPath:
      'polygon(50% 0%, 68% 22%, 100% 18%, 82% 45%, 100% 72%, 68% 62%, 62% 100%, 50% 78%, 38% 100%, 32% 62%, 0% 72%, 18% 45%, 0% 18%, 32% 22%)',
    description: '怒りと意地が炎となって燃え上がる...',
  },
  {
    level: 4,
    name: '鋼の意志',
    minXP: 600,
    nextXP: 1000,
    glowColor: '#e2e8f0',
    textColor: '#f1f5f9',
    bgClass: 'bg-gradient-to-br from-slate-200 to-slate-500',
    animClass: 'avatar-iron',
    clipPath:
      'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
    description: '鋼鉄のような意志と精神が確立された...',
  },
  {
    level: 5,
    name: '不死鳥の覚醒',
    minXP: 1000,
    nextXP: Infinity,
    glowColor: '#fbbf24',
    textColor: '#fde68a',
    bgClass: 'bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500',
    animClass: 'avatar-phoenix',
    clipPath:
      'polygon(50% 10%, 64% 0%, 100% 14%, 74% 36%, 90% 52%, 68% 46%, 64% 80%, 55% 54%, 50% 100%, 45% 54%, 36% 80%, 32% 46%, 10% 52%, 26% 36%, 0% 14%, 36% 0%)',
    description: '全ての苦難を糧に、不死鳥として覚醒した！',
  },
];

export function getEvolutionStage(totalXP: number): EvolutionStage {
  for (let i = EVOLUTION_STAGES.length - 1; i >= 0; i--) {
    if (totalXP >= EVOLUTION_STAGES[i].minXP) {
      return EVOLUTION_STAGES[i];
    }
  }
  return EVOLUTION_STAGES[0];
}
