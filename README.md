# Pocket Switchyard

A cozy, offline Android-first arrow puzzle built with **Expo SDK 57**, React Native, TypeScript, Expo Router, Reanimated, AsyncStorage, and lightweight sound and haptic feedback.

## Phase 4 checkpoint — 40 playable puzzles

- 40 fixed, validated **4×4** puzzles in four chapters (some are transformed variations of established puzzle patterns).
- Levels 1–5 teach arrow escape order; levels 6–40 require row shifts in the solver's shortest winning solutions.
- Every level has a checked minimum-move solution, sequential unlock, a par score, and 1–3 star completion rating.
- Tap a cart to exit along its facing direction if its full path is clear. Blocked arrows shake and cost no moves.
- Left and right row controls shift one cell with cyclic wraparound. Undo, restart, pause, replay, and continue are available.
- **Hint now works:** on tap, a cancelable, chunked BFS finds the next action from the *current board* and highlights the right cart or row control. A bounded search can sometimes reach its limit after unusual shifts; the UI explains when this happens.
- Progress, best move counts, stars, sound, haptics, and reduced motion persist locally using a validated, versioned AsyncStorage save. Reset requires confirmation.
- Reduced motion skips cart movement/shake and victory reveals; compact layouts prioritize board and action buttons on shorter screens.
- Offline sound effects and haptics can be disabled in Settings.

The app contains no ads, tracking, backend, authentication, multiplayer or payments.

## Run on Android

```sh
cd /path/to/pocket-switchyard
npm install
npx expo start
```

Use an **SDK 57 compatible** Expo Go installation or development build. Press `a` in Metro when an Android emulator is configured. Rebuild existing development clients after changes to installed native modules.

## Automated checks

```sh
npm test
npx tsc --noEmit
npx expo lint
npx expo export --platform android
```

Tests validate each of the 40 boards with bounded BFS, replay the solver's shortest winning sequence, verify par and shift requirements, test immutable move/undo/restart behavior, validate cancelable hint searches, and test save-data parsing.

## Manual testing

See [docs/ANDROID_QA.md](docs/ANDROID_QA.md) for device test cases, including small screens, very quick taps, row wraparound, hints after detours, backgrounding, progress restoration, sound/haptics and reduced motion. An Android production bundle is **not** an installable APK; the app has not yet been verified on physical Android hardware.

## Main modules

- `src/app`: Home, Levels, Gameplay and Settings via Expo Router
- `src/components`: puzzle tiles, board, controls, reusable visual elements
- `src/game/engine.ts`: pure immutable game transitions
- `src/game/solver.ts`: bounded search, resumable hint search, puzzle validation
- `src/game/levels.ts`: 40 serialized board definitions and par move counts
- `src/game/progress.tsx` and `src/storage/save.ts`: progress and settings persistence
- `src/hooks/useGame.ts`: animation input lock and gameplay orchestration
- `tests`: engine, solver, hints and save validation

## Next: Phase 5

Create original icon and splash assets, configure EAS build profiles, replace the placeholder Android package ID, build a preview APK and production AAB, run the device QA checklist, and prepare Google Play closed testing.
