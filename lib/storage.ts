import { AppState, Entry } from './types';

const STORAGE_KEY = 'damage_xp_state';

export function loadState(): AppState {
  if (typeof window === 'undefined') {
    return { totalXP: 0, entries: [] };
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as AppState;
    }
  } catch {
    // ignore corrupt data
  }
  return { totalXP: 0, entries: [] };
}

export function saveState(state: AppState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

export function addEntry(state: AppState, entry: Entry): AppState {
  const newState: AppState = {
    totalXP: state.totalXP + entry.xpGained,
    entries: [entry, ...state.entries].slice(0, 50),
  };
  saveState(newState);
  return newState;
}

export function resetState(): AppState {
  const fresh: AppState = { totalXP: 0, entries: [] };
  saveState(fresh);
  return fresh;
}
