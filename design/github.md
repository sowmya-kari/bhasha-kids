repo: sowmya-kari/bhasha-kids
branch: main

## Last sync
date: 2026-10-28T00:00:00Z
commit: c5d59fb091b0

### Updated in this project
- Mobile brought to parity with iPad: intro video with sound toggle, Magic Studio coloring, Donate card (payment link pending).
- Mobile letters use a full-width poster that taps to flip to tracing.
- Story covers ported to mobile; Story Garden list and reader no longer use emoji.
- Little Garden Sort added (public/garden-sort.html); Pattern Garden and Garden Sort still use emoji tokens pending artwork.

## Previous sync
date: 2026-09-21T00:00:00Z
commit: c5d59fb091b0

### Updated in this project
- The Math Corner screen is now Vani's Magic Pattern Garden (public/pattern-garden.html): six pattern levels (AB, AAB, ABC, size, shape, mixed) across Flower / Butterfly / Rainbow gardens, built on the user's supplied garden artwork with live tokens, sparkles and Vani's reactions overlaid.
- public/math-corner.html (numbers/add/take away/times/share) removed; nav, home tile and progress labels renamed to Magic Pattern Garden.
- Phone uses a portrait composition of the same game (?portrait=1): cropped title band, full-width pattern strip, 94px choice cards.

## Previous sync
date: 2026-09-18T02:48:50Z
commit: c5d59fb091b0

### Updated in this project
- Math Corner's counting game replaced with the user's own math_corner.html (copied to public/math-corner.html, embedded with ?embed=1 so the page's duplicate header is hidden).
- Audio playback now tries the .mp3 next to each recording first, then the original .wav, then device speech — the repo's WAVs still cannot be imported here (audio is refused by the import; a single-file test copied 0 of 1).
- Vani added to the other end of the "Your buddy Vageesh" praise panel on the letters screen.

## Previous sync
date: 2026-09-18T02:20:00Z
commit: c5d59fb091b0

### Updated in this project
- All nine games are playable on the tablet: Happy Match Adventure, Drag Match & Learn, Paryavaran Hero and Letter Rain built from app/more-games.tsx data; Find It for Mithu runs the repo's public/find-it-for-mithu.html in-frame.
- The phone version gained a playable game layer (Letter Rain, Happy Match, Find It, Drag Match & Learn, Paryavaran Hero); the four canvas/drag-heavy ones stay cards there.
- Drag, Match & Learn uses drag-and-drop on tablet and tap-picture-then-tap-word on phone.

## Previous sync
date: 2026-09-17T16:17:07Z
commit: c5d59fb091b0

### Updated in this project
- All 20 stories imported from app/story-garden.tsx (was 8), with the 12 missing covers from public/assets/images/stories/.
- Hindi letters now map explicitly to poster art (31 letters); unmatched letters get a painted card with Vani instead of an emoji.
- Read aloud and the lesson Hear button play real audio: a recorded clip if present at public/assets/audio/, otherwise device speech; a note shows when no Telugu/Hindi voice is installed.
- The repo DOES carry the recordings at public/assets/audio/stories/*.wav (~550KB each), but .wav cannot be imported into this project by the GitHub tools (images and fonts only) — the player reads the repo naming convention <story-id>-<language>-<page>.wav plus -ending.wav, so the files work as soon as they are uploaded here.
- Completion card gained a "Hear the ending" button for the -ending.wav clips.

## Previous sync
date: 2026-09-16T20:48:01Z
commit: c5d59fb091b0

### Updated in this project
- All 52 letter posters imported (was 28); the letter→poster map now follows app/TeluguPosterLetters.tsx exactly, so every Telugu vowel and consonant shows its poster.
- Hindi letters get poster art by matching the example's meaning, plus the repo's VISUAL emoji table as the fallback card.
- Hindi examples completed for all 33 consonants.
- Home hub cards use 3D illustrations cropped from the user's screenshot (public/assets/icons/).

## Previous sync
date: 2026-09-16T00:17:44Z
commit: c5d59fb091b0

### Updated in this project
- Math Corner now carries Vageesh's Number Adventure (cover card → full-bleed play) and Number Treasure Hunt, both copied from the repo (app/math-corner.tsx, public/number-adventure.html, public/treasure-hunt.html) and run in-frame.
- treasure-hunt.html image paths repointed to the project's local Vageesh art.
- Letters practice guide moved from SVG to canvas so Watch Me / Try Yourself work.

## Previous sync
date: 2026-09-15T20:12:36Z
commit: e0ce462a382e

### Updated in this project
- Quick, Tap the Action! draws all four choice panels from the six lightweight action photos (eat, drink, run, jump, read, draw); the nine 2MB photos were removed because they stalled the page.
- Quick, Tap the Action! and Vani's Magic Art Studio built; 18 coloring pages imported.
- Drag the First Letter replaced Letter Rain as the playable letter game.

## Previous sync
date: 2026-09-15T19:29:55Z
commit: e0ce462a382e

### Updated in this project
- Tablet (iPad landscape) version added: side rail, two-pane activity screens.
- Letters screen rebuilt as the repo's poster lesson (TeluguPosterLetters): 9:16 poster, dotted trace + Watch Me, five controls, letter filmstrip.
- Real art imported: 28 telugu-posters/*.webp, 8 stories/*.jpg covers.
- Letter Rain and Balloon Pop are playable in the games hub.

## Sync history
date: 2026-09-15T00:10:00Z
- Ported Bhasha Kids to a phone app: 9 screens in one interactive prototype.
- Palette, mascots, splash art and letter/story/game content taken from the repo.
- Two alternate home screens (learning path, buddy-led) for comparison.

## Screen map
| Project screen | Repo files |
| --- | --- |
| Welcome / language pick | app/opening-screen.tsx, app/opening-screen.css, public/assets/welcome/* |
| Home hub | app/LegacyHome.tsx (hero, phone mock, feature grid), app/globals.css |
| Letters grid | app/TeluguPosterLetters.tsx, app/telugu-poster-letters.css, public/assets/images/telugu-posters/* |
| Letter lesson | app/LegacyHome.tsx (examples, voice-row), app/alphabet.css, app/illustrated-letters.css |
| Tracing | app/LegacyHome.tsx (TracePad, scoreTrace), app/alphabet.css (.trace-*) |
| Story Garden + reader | app/story-garden.tsx (stories data), app/story-garden.css, public/assets/images/stories/* |
| Guninthalu + Word Builder | app/akshara-builder.tsx (consonants, vowels, virama, word lab, transliteration), app/akshara-builder.css, public/telugu-word-builder.html |
| Magic Pattern Garden | public/pattern-garden.html (new, from user artwork + brief), app/math-corner.tsx (compare & sort copy), public/number-adventure.html, public/treasure-hunt.html |
| Games hub + playable games | app/more-games.tsx (game list, actions data, LetterMatch, MemoryGame themes, foodCards, ecoItems/bins/facts/quotes, LetterRain), app/more-games.css (.quiz-*, .coloring-*, .memory-*, .eco-*), public/pop-letter.html (Balloon Pop engine), public/find-it-for-mithu.html, public/assets/coloring/original/*, public/assets/images/actions/* |
| Little Garden Sort | public/garden-sort.html (new — not in repo today) |
| Intro video / Donate | new — not in repo today |
| Rewards / buddies | app/mascot-buddies.tsx, app/mascot-buddies.css, app/BuddyTip.tsx |
| Parent dashboard | new — not in repo today |
