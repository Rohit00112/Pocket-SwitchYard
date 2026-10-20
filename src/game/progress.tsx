import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { freshSave, loadSave, persistSave, type GameSettings, type LevelRecord, type SaveData } from '@/storage/save';
import { palette } from '@/theme/tokens';

import { levels } from './levels';

interface ProgressContextValue {
  readonly unlocked: number;
  readonly records: Readonly<Record<number, LevelRecord>>;
  readonly totalStars: number;
  readonly completedCount: number;
  readonly settings: GameSettings;
  complete: (levelId: number, moves: number, stars: 1 | 2 | 3) => void;
  setSetting: (key: keyof GameSettings, value: boolean) => void;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [save, setSave] = useState<SaveData>(freshSave);
  const [loaded, setLoaded] = useState(false);
  const current = useRef(save);
  const hydrated = useRef(false);
  const pendingWrite = useRef<Promise<void>>(Promise.resolve());

  const change = useCallback((update: (previous: SaveData) => SaveData) => {
    const next = update(current.current);
    current.current = next;
    setSave(next);
  }, []);

  useEffect(() => {
    let alive = true;
    loadSave(levels.length).then((restored) => {
      if (!alive) return;
      current.current = restored;
      setSave(restored);
      hydrated.current = true;
      setLoaded(true);
    });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    // Serialized writes prevent an older completion from overwriting a newer reset.
    pendingWrite.current = pendingWrite.current.catch(() => {}).then(() => persistSave(save)).catch(() => {});
  }, [save]);

  const complete = useCallback((levelId: number, moves: number, stars: 1 | 2 | 3) => {
    if (!levels.some((level) => level.id === levelId) || !Number.isInteger(moves) || moves < 1) return;
    change((old) => {
      const best = old.records[levelId];
      return {
        ...old,
        records: {
          ...old.records,
          [levelId]: {
            stars: best ? Math.max(best.stars, stars) as 1 | 2 | 3 : stars,
            bestMoves: best ? Math.min(best.bestMoves, moves) : moves,
          },
        },
        unlocked: Math.max(old.unlocked, Math.min(levels.length, levelId + 1)),
      };
    });
  }, [change]);

  const setSetting = useCallback((key: keyof GameSettings, value: boolean) =>
    change((old) => ({ ...old, settings: { ...old.settings, [key]: value } })), [change]);
  const resetProgress = useCallback(() => change((old) => ({
    ...freshSave(), settings: old.settings,
  })), [change]);

  const value = useMemo<ProgressContextValue>(() => ({
    unlocked: save.unlocked,
    records: save.records,
    settings: save.settings,
    totalStars: Object.values(save.records).reduce((sum, record) => sum + record.stars, 0),
    completedCount: Object.keys(save.records).length,
    complete, setSetting, resetProgress,
  }), [save, complete, setSetting, resetProgress]);

  if (!loaded) return <View style={styles.loading}><ActivityIndicator size="large" color={palette.teal} /></View>;
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be called inside ProgressProvider');
  return context;
}
const styles = StyleSheet.create({ loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.background } });
