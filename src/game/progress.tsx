import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { levels } from './levels';

export interface LevelRecord { readonly stars: 1 | 2 | 3; readonly bestMoves: number; }

interface ProgressContextValue {
  readonly unlocked: number;
  readonly records: Readonly<Record<number, LevelRecord>>;
  readonly totalStars: number;
  readonly completedCount: number;
  complete: (levelId: number, moves: number, stars: 1 | 2 | 3) => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

/** Session progress now; persistent AsyncStorage restoration arrives in Phase 3. */
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<Record<number, LevelRecord>>({});
  const [unlocked, setUnlocked] = useState(1);

  const value = useMemo<ProgressContextValue>(() => ({
    unlocked,
    records,
    totalStars: Object.values(records).reduce((sum, record) => sum + record.stars, 0),
    completedCount: Object.keys(records).length,
    complete: (levelId, moves, stars) => {
      if (!levels.some((level) => level.id === levelId)) return;
      setRecords((previous) => {
        const best = previous[levelId];
        return {
          ...previous,
          [levelId]: { stars: best ? Math.max(best.stars, stars) as 1 | 2 | 3 : stars, bestMoves: best ? Math.min(best.bestMoves, moves) : moves },
        };
      });
      setUnlocked((previous) => Math.max(previous, Math.min(levels.length, levelId + 1)));
    },
  }), [unlocked, records]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be called inside ProgressProvider');
  return context;
}
