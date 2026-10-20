import AsyncStorage from '@react-native-async-storage/async-storage';

export const SAVE_KEY = '@pocket-switchyard/save/v1';
export const SAVE_VERSION = 1;
export interface LevelRecord { stars: 1 | 2 | 3; bestMoves: number }
export interface GameSettings { sound: boolean; haptics: boolean; reducedMotion: boolean }
export interface SaveData {
  version: 1;
  unlocked: number;
  records: Record<number, LevelRecord>;
  settings: GameSettings;
}
export const defaultSettings: GameSettings = { sound: true, haptics: true, reducedMotion: false };
export const freshSave = (): SaveData => ({
  version: SAVE_VERSION, unlocked: 1, records: {}, settings: { ...defaultSettings },
});

/** Trust nothing from persistent storage: validate, clamp and discard invalid entries. */
export function parseSave(raw: string | null, maximumLevel: number): SaveData {
  const empty = freshSave();
  if (!raw) return empty;
  try {
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== 'object') return empty;
    const source = data as Record<string, unknown>;
    if (source.version !== SAVE_VERSION) return empty;
    const records: Record<number, LevelRecord> = {};
    if (source.records && typeof source.records === 'object' && !Array.isArray(source.records)) {
      for (const [key, record] of Object.entries(source.records)) {
        const id = Number(key);
        if (!Number.isInteger(id) || id < 1 || id > maximumLevel || !record || typeof record !== 'object') continue;
        const item = record as Record<string, unknown>;
        if (![1, 2, 3].includes(item.stars as number) || !Number.isSafeInteger(item.bestMoves) || (item.bestMoves as number) < 1) continue;
        records[id] = { stars: item.stars as 1 | 2 | 3, bestMoves: item.bestMoves as number };
      }
    }
    // Unlocked levels must be backed by sequential completions.
    let unlocked = 1;
    while (unlocked < maximumLevel && records[unlocked]) unlocked++;
    const settingsSource = source.settings && typeof source.settings === 'object' ? source.settings as Record<string, unknown> : {};
    return {
      version: SAVE_VERSION, unlocked, records,
      settings: {
        sound: typeof settingsSource.sound === 'boolean' ? settingsSource.sound : empty.settings.sound,
        haptics: typeof settingsSource.haptics === 'boolean' ? settingsSource.haptics : empty.settings.haptics,
        reducedMotion: typeof settingsSource.reducedMotion === 'boolean' ? settingsSource.reducedMotion : empty.settings.reducedMotion,
      },
    };
  } catch { return empty; }
}

export async function loadSave(maximumLevel: number): Promise<SaveData> {
  try { return parseSave(await AsyncStorage.getItem(SAVE_KEY), maximumLevel); }
  catch { return freshSave(); }
}

export async function persistSave(save: SaveData): Promise<void> {
  await AsyncStorage.setItem(SAVE_KEY, JSON.stringify(save));
}
