# Pocket Switchyard

A cozy, offline-first arrow puzzle game for Android, built with Expo SDK 57, React Native, Expo Router and strict TypeScript.

## Phase 1 status

This checkpoint provides a branded home screen, a level list, a responsive static 4×4 board with directional cart tiles, disabled row controls, a pauseable preview, and typed game models. **Cart tapping, row shifts, undo, star scoring, saving, sound and haptics are not implemented yet.** Those are scheduled for subsequent phases.

## Run on Android

Requirements: Node.js, npm, Android emulator or compatible development build on a physical Android device.

```sh
npm install
npx expo start
```

Scan the QR code using a compatible Expo Go (if supported for SDK 57) or open it in an Android development build. Press `a` to launch the Android emulator if configured.

Check the code and create a local Android JavaScript bundle:

```sh
npx tsc --noEmit
npx expo lint
npx expo export --platform android
```

For a future EAS preview APK after registering an Expo account and configuring EAS:

```sh
npx eas-cli@latest build:configure
npx eas-cli@latest build --platform android --profile preview
```

The preview profile and EAS configuration will be completed in Phase 5. The Android package ID in `app.json` is a placeholder.

## Structure

- `src/app`: Expo Router screens and navigation
- `src/components`: reusable cart drawing, board, row controls and buttons
- `src/game`: serializable game types, authored level preview and engine primitives
- `src/theme`: visual tokens

## Next

Implement the pure game reducer, blocking and exit rules, cyclic row shifts, one-entry-per-action undo, restart, completion detection, and validate the first five solvable levels.
