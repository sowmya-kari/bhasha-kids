# Bhasha Kids — Project State

Last consolidated: September 15, 2026

This document records the Bhasha Kids product direction, approved UX decisions, implemented areas known to be present in the repository, and work that was discussed or designed during development. It is intended to keep the project recoverable even when a local working copy is unavailable.

## Product direction

Bhasha Kids is a wholesome, child-friendly bilingual learning experience centered on Telugu and Hindi. It should work well on phones, tablets/iPads, and desktop browsers. The visual direction is polished, warm, playful, and illustration-led rather than looking like a generic SVG demo.

## Core characters

- **Vageesh** — age 6, teal, Language Explorer. Focus: letters, early math, logic puzzles. Catchphrase: “Let’s solve it together!” He acts as a co-solver and encourages children.
- **Vani** — age 6, yellow, Story Fairy. Focus: storytelling, sing-alongs, drawing. Catchphrase: “Every story begins with a word.”
- **Mithu** — talking parrot, used especially for pronunciation/letter activities.
- **Mayuri** — achievement peacock.
- **Gaja** and **Bujji** — supporting world characters.

Mascot faces, hair, clothing, hands, expressions, and proportions should remain consistent. Avoid vague temporary mascot art and unfinished SVG-style character treatment.

## Approved M1 welcome flow

The post-splash welcome screen should have:

1. A single centered **Basha Kids** title.
2. Vageesh + Vani in the approved reference layout.
3. Speech bubbles from the characters.
4. A green **Let’s Begin** button.
5. Language choices using the actual scripts:
   - Telugu: **అ**
   - Hindi: **अ**
6. No duplicate title treatment.

The visual mood is cream/off-white with indigo/purple branding, purple interaction accents, teal Vageesh, coral/pink Vani, and gold highlights.

## Learning areas

### Letters

- Telugu and Hindi letter learning are core.
- Telugu vowels (Acchulu) and consonants (Hallulu) are supported.
- Telugu consonant navigation/strip scrolling was fixed so later consonants remain reachable and the active consonant stays visible.
- Letter experiences should be visual and interactive, with large letter cards, examples, tracing, and audio.
- “A ante amma / A se anar” style learning is desired, while poster artwork itself should not contain English explanatory text.
- Telugu vattulu/combined-letter learning is a planned area and should include examples such as the user’s requested “sowmya” style.
- Guninthalu should remain a distinct game-like learning section rather than being mixed into the basic vowel/consonant experience.

### Posters and audio

- Telugu poster assets are stored under `public/assets/images/telugu-posters/`.
- The repository currently contains Telugu poster assets numbered 01–52.
- The desired poster direction is a flower-garden setting, with Mithu as the character in the artwork.
- Letter/example audio is stored under `public/assets/audio/` and story audio under `public/assets/audio/stories/`.
- Voice recordings are intended as audio-only learning support; no spoken intro should be added automatically.

### Stories — Katha Vanam

The former Story Garden concept is now **Katha Vanam**.

Target content: approximately 20 Aesop-style Telugu/Hindi stories, including:

- Lion & Mouse
- Tortoise & Hare
- Fox & Grapes
- Fox & Stork
- Ant & Grasshopper
- Boy Who Cried Wolf
- Bundle of Sticks
- Crow & Pitcher
- Dog & Reflection
- Golden Goose
- Hare & Friends
- Honest Woodcutter
- Lion & Rabbit
- Milkmaid & Pail
- Peacock & Crane
- Shepherd & Goat
- Travelers & Bear
- Two Mice
- Wind & Sun
- Wolf & Crane

The story experience should use full illustrations, tile-level audio controls, and bilingual Telugu/Hindi support where assets exist. Existing repository story images and audio are preserved as the current recoverable baseline.

## Games and activities

The project has included or planned:

- **Pop Letter** — separate Telugu/Hindi modes with scoring.
- **Drag & Sort** — fruits/flowers/vegetables, 15 cards per round, with varied/unlimited rounds.
- **Mithu Match / Find It for Mithu** — Mithu-centered matching/find activity.
- **Telugu Word Builder / Akshara Builder** — interactive Telugu word/akshara construction.
- **Vageesh Number Adventure** — the preferred replacement for the earlier math/game direction; one-file implementation was requested.
- **Vani’s Magic Art Studio** — coloring experience with a color-pencil palette; do not use a peacock as the main coloring character.
- **Paryavaran Hero** — environmental game with Vageesh/Vani animation; animation should not look like temporary SVG art. A previous layout issue involved the sun clipping Vageesh and must be avoided in future revisions.
- **Parrot Balloon vs Letter Rain** — these were considered too similar and should remain differentiated if both are retained.

## Math direction

A large standalone Math Corner was removed from the M1 scope. Math can have a small homepage entry/preview, with richer bilingual math learning planned for a later milestone. Early math and logic can still be part of Vageesh’s role.

## Current repository baseline

The current `main` branch already contains substantial recoverable work, including:

- Welcome/splash components and styling.
- Vageesh/Vani assets and mascot components.
- Telugu poster integration and poster assets.
- Telugu letter navigation and lesson wiring.
- Akshara/word builder components.
- Story/Katha Vanam code and story image/audio assets.
- Mithu Match and other game components.
- Vani coloring assets and styling.
- Vageesh Number Adventure assets/pages.
- Math Corner code retained in the repository as existing implementation, even though the large Math Corner is out of M1 scope.
- Responsive styling and build/test configuration.

## Important recovery note

The local working copy that was used during recent design/testing is not currently available in the ChatGPT workspace. Therefore, this repository state is the authoritative recoverable source. Exact uncommitted local-only binary assets or code changes cannot be reconstructed merely from memory. When a new local working copy is needed, start from this GitHub `main` branch rather than creating a separate project from scratch.

## Working rule going forward

GitHub changes are authorized when the user explicitly asks to put work on GitHub. For Bhasha Kids, preserve the current `main` baseline, make changes deliberately, and verify the implementation before replacing or deleting existing functionality.
