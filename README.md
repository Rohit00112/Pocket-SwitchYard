# Pocket Switchyard

A cozy Android-first offline arrow puzzle, built with Expo SDK 57, React Native, Expo Router, Reanimated and TypeScript.

## Current checkpoint: Phase 2 — playable puzzles

- Home and level selection screens with session-only unlocked levels, earned stars and best moves.
- Five authored, solver-verified 4×4 puzzles. Levels 1–5 teach escape order. Row shifts are available now and become required in the next level pack (levels 6–10).
- Tap a directional cart to exit when all cells between it and that board edge are empty.
- Left/right controls cyclically shift a complete row by one cell. Every successful exit and row shift counts as one move.
- Blocked taps shake without counting as moves. Animated inputs are locked to prevent duplicate moves.
- Undo restores the previous board, move count and status. Restart resets the full puzzle.
- Pause and resume, level-complete result, par-based 1–3 stars, replay and continue.

**Current limitations:** Progress lasts until the app process is restarted. AsyncStorage, the dedicated settings screen, sound and haptics, more levels, advanced animations, and production asset work are planned for later phases. The hint button remains clearly disabled.

## Start on Android

You'll need Node.js, npm, an Android emulator or a physical device with a compatible Expo Go/development build.

```sh
cd /path/to/pocket-switchyard
npm install
npx expo start
```

Open the QR code using an SDK-57-compatible Expo Go/development build. If an Android emulator is installed and running, press `a` in the Metro terminal.

## Verify

```sh
npm test
npx tsc --noEmit
npx expo lint
npx expo export --platform android
```

The Jest tests validate path checks, blocked/successful exits, wraparound row shifts, undo, restart, pause, win detection, scoring, malformed levels and shortest solution replay for all five levels.

## Try the game

1. Open **Play** and tap a cart whose way to its facing edge is entirely empty.
2. Tap a blocked cart to see the shake and unchanged move counter.
3. Use the small `‹` and `›` buttons beside a row. An arrow falling off a side reappears on the opposite side of that row.
4. Use **Undo** to restore a move. Use **Restart** to return to the beginning.
5. Clear the entire board to see the star result and unlock the next level.

Manual checks still needed on a real device: small-screen layout, quick successive taps, backgrounding during an animation, orientation lock, pause, restart, and navigation between levels.

## Architecture

- `src/app/`: file-based navigation/screens
- `src/components/`: board, Reanimated cart tiles, row controls, buttons, branding
- `src/game/engine.ts`: pure immutable game transitions
- `src/game/solver.ts`: bounded BFS and level validation, run during development/tests
- `src/game/levels.ts`: authored puzzle definitions and par values
- `src/game/progress.tsx`: session progression (AsyncStorage will replace/extend this)
- `src/hooks/useGame.ts`: input locking and animation orchestration
- `src/theme/tokens.ts`: colors, spacing and direction styling
- `tests/`: Jest engine and level checks

## Next: Phase 3

Add versioned AsyncStorage saves, rehydration, Settings (sound/haptics/reduced motion/reset), refined completion animations, tutorials, and the next level pack introducing required row shifts.

## Android builds (planned for Phase 5)

The Android package ID in `app.json` is a placeholder. Configure EAS and its preview profile before creating an installable APK or production AAB.
