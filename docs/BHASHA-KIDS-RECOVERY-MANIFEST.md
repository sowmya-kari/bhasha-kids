# Bhasha Kids — Consolidated Recovery Manifest

## Purpose
This manifest consolidates the Bhasha Kids work discussed during development so the repository remains the single recoverable source of truth.

## Already present in GitHub
- Responsive Next.js/React application structure.
- Splash/opening screen and post-splash welcome flow.
- Vageesh/Vani mascot components and styling.
- Telugu letter lessons and navigation fixes.
- Telugu poster integration and poster asset collection.
- Telugu Akshara/Word Builder.
- Story Garden/Katha Vanam implementation.
- Story image/audio asset handling.
- Mithu Match and the broader game collection.
- Vani's Magic Art Studio/coloring implementation.
- Paryavaran Hero / Eco Sort game.
- Math Corner and Number Adventure implementation/assets.
- Voice button/audio interaction support.
- Responsive/global styling and project configuration.

## Product decisions that must be preserved

### M1 scope
- Telugu + Hindi learning are the core.
- Preserve Letters, Stories, Games, and audio.
- Vageesh and Vani are the central guides.
- Do not make Math Corner a large standalone M1 destination; keep math as a small entry/preview while richer bilingual math is a later milestone.

### Welcome screen
- One centered Bhasha Kids title.
- Vageesh + Vani in the approved reference relationship/poses.
- Speech bubbles.
- Green Let's Begin button.
- Telugu choice: అ.
- Hindi choice: अ.
- No duplicate title.

### Mascot direction
- Vageesh: teal, age 6, Language Explorer, letters/early math/logic, co-solver.
- Vani: yellow, age 6, Story Fairy, stories/sing-alongs/drawing.
- Mithu: pronunciation/parrot guide.
- Mayuri: achievement peacock.
- Gaja and Bujji: supporting characters.
- Character anatomy, faces, hair, clothing, hands and expressions should remain consistent.
- Avoid unfinished/generic SVG-looking mascot art.

### Letters
- Telugu vowels (Acchulu) and consonants (Hallulu).
- Hindi ka–gya learning.
- Large visual letter cards and instant tracing.
- Example words such as amma/aakulu and anar should be represented through the appropriate language/script.
- Guninthalu remains a distinct game-like section.
- Telugu vattulu/combined-letter learning is a planned enhancement.

### Posters
- Telugu posters live under public/assets/images/telugu-posters/.
- Existing Telugu collection includes numbered poster assets.
- Preferred new poster art: flower-garden setting with Mithu.
- Do not put English explanatory text inside poster artwork.

### Stories / Katha Vanam
Target set: 20 Aesop-style stories including Lion & Mouse, Tortoise & Hare, Fox & Grapes, Fox & Stork, Ant & Grasshopper, Boy Who Cried Wolf, Bundle of Sticks, Crow & Pitcher, Dog & Reflection, Golden Goose, Hare & Friends, Honest Woodcutter, Lion & Rabbit, Milkmaid & Pail, Peacock & Crane, Shepherd & Goat, Travelers & Bear, Two Mice, Wind & Sun, and Wolf & Crane.

Story tiles should support full illustrations and tile-level audio. Telugu/Hindi versions should remain clearly separated and child-friendly.

### Games
- Pop Letter: separate Telugu/Hindi modes + score.
- Drag & Sort: fruits/flowers/vegetables, 15 cards per round, varied rounds.
- Telugu Word Builder/Akshara Builder.
- Vageesh Number Adventure.
- Vani's Magic Art Studio: coloring with color-pencil palette; no peacock as the main coloring character.
- Paryavaran Hero: environmental sorting/gameplay with Vageesh/Vani; prevent character clipping by environmental decorations such as the sun.
- Parrot Balloon and Letter Rain should not feel like duplicate games.

### Audio
- Audio is a learning aid, not a spoken UI intro.
- Preserve existing audio assets and VoiceButton behavior.
- Intended voice recordings may be supplied through the user's Vois Labs/Kavya workflow.

## Known gap
The exact historical local working copy is unavailable in the current workspace. Therefore, exact uncommitted local-only binary files or code cannot be claimed as recovered. This manifest preserves the known requirements and the repository's recoverable implementation so future work can be rebuilt against the same specification.

## GitHub rule
Changes may be committed when explicitly requested by the user. Preserve existing working features and avoid destructive replacement without verification.
