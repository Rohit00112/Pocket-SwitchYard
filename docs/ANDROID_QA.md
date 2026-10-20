# Pocket Switchyard — Android device QA

Use this checklist on at least a smaller Android phone (about 320–360 dp wide) and a larger phone (about 400–440 dp wide). Record device, OS, app build and pass/fail. Automated tests are not a substitute for these checks.

## Core gameplay

- [ ] Launch without an internet connection; Home and saved levels appear.
- [ ] Complete level 1 by tapping unobstructed arrows; each valid exit counts exactly once.
- [ ] Tap a blocked arrow multiple times; no cart exits and no extra move is counted.
- [ ] On level 6, shift a row left and right; every row wraps one cell without changing cart directions.
- [ ] Rapidly tap two arrows or shift controls while an animation runs; no duplicate action or lost cart occurs.
- [ ] Undo an exit and a shift; board, move counter and status return exactly to their previous values.
- [ ] Restart after multiple moves; original board and zero moves return.
- [ ] Pause and resume; gameplay controls do not act while paused.
- [ ] Open another level while navigating quickly; the correct starting board appears.
- [ ] Complete a level; stars, move count, best moves, Continue and Replay work.

## Hints and accessibility

- [ ] Hint highlights a legal cart or row control and shows the same action in text.
- [ ] Make a non-optimal shift, request a hint, and follow it; the hinted action is legal.
- [ ] Press Hint while repeatedly tapping; search cancels or stays consistent with the current board.
- [ ] Enable reduced motion; cart movements and shake are minimized while game rules remain unchanged.
- [ ] Confirm touch targets, legibility and board fit on 320 dp wide devices.
- [ ] Check the board/action row without scrolling on ordinary portrait screens; on very short screens, the page remains usable when scrolled.
- [ ] Verify gameplay remains portrait-only on device rotation.

## Saving and feedback

- [ ] Complete a level, force-close the app, reopen; stars, best moves and next unlock persist.
- [ ] Toggle sound/haptics off; no corresponding feedback plays during gameplay.
- [ ] Toggle them back on; valid, blocked and victory feedback is restored.
- [ ] Change reduced motion, force-close, reopen; preference remains selected.
- [ ] Background the app mid-animation and return; the next tap works and move count is correct.
- [ ] Reset progress then restart the app; unlocked levels, stars and best moves are cleared, preferences remain.
- [ ] Toggle airplane mode throughout; no gameplay or data loss.

## Release acceptance

- [ ] No unexpected crashes, freezes, off-screen controls or unusable buttons.
- [ ] Performance feels responsive on a mid-range Android phone; if possible profile frame pacing.
- [ ] Generated preview APK installs and opens without Metro (Phase 5).
- [ ] Build identity, app icon, splash and Google Play metadata verified (Phase 5).
