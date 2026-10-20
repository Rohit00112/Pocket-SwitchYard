jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

import { defaultSettings, freshSave, parseSave, SAVE_VERSION } from '../src/storage/save';

describe('versioned local save handling', () => {
  test('returns safe defaults for empty, malformed and outdated records', () => {
    expect(parseSave(null, 10)).toEqual(freshSave());
    expect(parseSave('not-json', 10)).toEqual(freshSave());
    expect(parseSave(JSON.stringify({ version: 999 }), 10)).toEqual(freshSave());
  });

  test('round trips valid progress and user preferences', () => {
    const save = {
      ...freshSave(),
      unlocked: 3,
      records: { 1: { stars: 3 as const, bestMoves: 4 }, 2: { stars: 2 as const, bestMoves: 7 } },
      settings: { sound: false, haptics: false, reducedMotion: true },
    };
    expect(parseSave(JSON.stringify(save), 10)).toEqual(save);
    expect(SAVE_VERSION).toBe(1);
  });

  test('validates saved entries and ignores forged unlock counts', () => {
    const restored = parseSave(JSON.stringify({
      version: 1, unlocked: 99,
      records: {
        1: { stars: 2, bestMoves: 5 },
        2: { stars: 0, bestMoves: -8 },
        3: { stars: 3, bestMoves: 7 },
        999: { stars: 3, bestMoves: 1 },
      },
      settings: { sound: 'not-a-boolean', haptics: false },
    }), 10);
    expect(restored.unlocked).toBe(2);
    expect(restored.records).toEqual({ 1: { stars: 2, bestMoves: 5 }, 3: { stars: 3, bestMoves: 7 } });
    expect(restored.settings).toEqual({ ...defaultSettings, haptics: false });
  });
});
