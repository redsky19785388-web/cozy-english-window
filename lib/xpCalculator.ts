// Negative experience keywords → bonus XP for going through pain
const NEGATIVE_KEYWORDS: { word: string; xp: number }[] = [
  { word: '辛い', xp: 30 },
  { word: 'つらい', xp: 30 },
  { word: '理不尽', xp: 50 },
  { word: '怒り', xp: 25 },
  { word: '悔しい', xp: 35 },
  { word: '悲しい', xp: 25 },
  { word: '苦しい', xp: 30 },
  { word: 'しんどい', xp: 25 },
  { word: '嫌い', xp: 20 },
  { word: '嫌だ', xp: 20 },
  { word: 'ムカつく', xp: 30 },
  { word: 'むかつく', xp: 30 },
  { word: 'きつい', xp: 25 },
  { word: '疲れた', xp: 20 },
  { word: 'ひどい', xp: 25 },
  { word: '最悪', xp: 35 },
  { word: 'つかれた', xp: 20 },
  { word: 'バカにされた', xp: 45 },
  { word: 'ストレス', xp: 30 },
];

// Endurance keywords → higher XP reward (you pushed through!)
const ENDURANCE_KEYWORDS: { word: string; xp: number }[] = [
  { word: '耐えた', xp: 60 },
  { word: '我慢', xp: 45 },
  { word: '頑張った', xp: 50 },
  { word: '乗り越えた', xp: 70 },
  { word: '踏ん張った', xp: 60 },
  { word: '諦めなかった', xp: 80 },
  { word: 'やり切った', xp: 65 },
  { word: '立ち向かった', xp: 70 },
  { word: '耐え抜いた', xp: 75 },
  { word: '続けた', xp: 40 },
  { word: '負けなかった', xp: 65 },
];

// Social context keywords → bonus for enduring people
const SOCIAL_KEYWORDS: { word: string; xp: number }[] = [
  { word: '先輩', xp: 20 },
  { word: '上司', xp: 25 },
  { word: '同僚', xp: 15 },
  { word: 'クライアント', xp: 20 },
  { word: 'お客', xp: 15 },
  { word: '客', xp: 10 },
  { word: '部長', xp: 30 },
  { word: '社長', xp: 40 },
  { word: '課長', xp: 25 },
  { word: '取引先', xp: 20 },
];

export function calculateXP(text: string): { xp: number; keywords: string[] } {
  if (!text.trim()) return { xp: 0, keywords: [] };

  // Base XP from character count (diminishing returns, max 80)
  const charXP = Math.min(Math.floor(text.length * 0.7), 80);

  let bonusXP = 0;
  const foundKeywords: string[] = [];

  const allKeywords = [...NEGATIVE_KEYWORDS, ...ENDURANCE_KEYWORDS, ...SOCIAL_KEYWORDS];

  for (const { word, xp } of allKeywords) {
    if (text.includes(word)) {
      bonusXP += xp;
      foundKeywords.push(word);
    }
  }

  return {
    xp: Math.max(1, charXP + bonusXP),
    keywords: foundKeywords,
  };
}
