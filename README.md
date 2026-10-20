# Pocket Switchyard

A cozy Android-first offline arrow puzzle made with Expo SDK 57, React Native, Expo Router, Reanimated and strict TypeScript.

## Current checkpoint — Phase 3

- Ten authored, solver-verified 4×4 levels: levels 1–5 teach exit order; levels 6–10 require shifting rows.
- Tap an arrow if the cells ahead of it to the relevant edge are all empty; otherwise it shakes without using a move.
- Shift whole rows with ‹ and ›, with one-cell cyclic wraparound and animation input locking.
- Undo, restart, pause, completion results, best moves and par-based 1–3 star scoring.
- Versioned AsyncStorage save restores completed levels, stars, best move counts, and settings on next launch. Corrupted and outdated saves fall back safely.
- Settings: sound effects, haptic feedback, reduced motion, and confirmed reset of progression while preserving settings.
- Small bundled sound cues on valid move, blocked arrow and success; Reanimated completion reveal respects reduced motion.
- Contextual tutorial text and clear hints for early levels. Hint action remains disabled until actual logic is built.

All game data stays on the device; no backend or account is required.

## Start on Android

```sh
cd /path/to/pocket-switchyard
npm install
npx expo start
```

Open the Expo QR code with an SDK-57-compatible Expo Go or a development build. Press `a` for a configured Android emulator. Native dependencies now include AsyncStorage, expo-audio and expo-haptics. If running a previously built native app, make a new development build after adding these modules.

## Validate

```sh
npm test
npx tsc --noEmit
npx expo lint
npx expo export --platform android
```

Automated tests verify movement rules, row wrapping, undo/restart, scoring, authored-level shortest winning sequences, and save-data parsing. Real-device QA is still needed for sound playback, haptics, animation smoothness, rapid taps, small screens, background/resume and cold-start restoration.

## Project locations

- `src/app`: Expo Router screens (Home, Levels, Game, Settings)
- `src/components`: board, arrow tile, controls, buttons, branding
- `src/game`: pure engine, scoring, BFS solver, curated levels, progression provider
- `src/hooks`: UI timing and sound effects
- `src/storage/save.ts`: versioned persisted-save format, sanitization and storage
- `assets/sounds`: original short offline WAV cues
- `tests`: game, level and saved-data tests

## Next — Phase 4

Grow the content to 40 validated boards, add real hints using a cached solver path, improve animations/layout for smaller Android devices, and conduct manual regression testing.

## Android release

The package identifier `com.example.pocketswitchyard` in `app.json` is a placeholder. Phase 5 will add EAS profiles, final icons/splash art, installable preview APK and Play Store testing preparation. Android JavaScript export alone is not an APK.
