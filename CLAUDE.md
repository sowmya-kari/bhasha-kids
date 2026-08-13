# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Basha Kids ("Little words. Big worlds.") is a bilingual (Telugu + Hindi) learning app for
children ages 4–8: letter lessons with tracing and audio, bilingual stories, a Guninthalu
(consonant+vowel sound-building) tool, a math corner, and a handful of mini-games.

It's built on **vinext**, a Next.js-compatible framework that deploys to Cloudflare Workers,
inside OpenAI's "Sites" hosting platform (see the imported `.openai/hosting.json` and the
`oai-authenticated-user-*` request headers). `package.json`, `package-lock.json`, and
`.openai/hosting.json` are **not committed to this repo** — they are injected by the hosting
control plane before install/build. Do not assume `npm install` works from a bare checkout
outside that platform.

## Commands

All lifecycle scripts must go through `scripts/sites-env.sh`, which sets up a project-local
`HOME`, npm cache, and Wrangler log paths under `.sites-runtime/` (gitignored, disposable).
Scripts re-exec themselves through it automatically if `SITES_ENV_READY` isn't already set, so
you can normally just run the npm script directly:

- `npm run install:ci` — single, non-retrying `npm ci`. Verifies the writable install
  environment, refuses to run if another install is already active for this project (via
  `flock` + a `/proc` scan for a concurrent `npm ci`), preflights and integrity-checks the
  locked vinext tarball, and prefers an image-seeded npm cache when its lockfile hash matches.
  Linux-only (`flock`, GNU `timeout`, `curl`, `sha256sum` required) — **not a native macOS
  script**.
- `npm run build` — bounded `vinext build` (default 3-minute timeout via GNU `timeout`), then
  runs `scripts/validate-artifact.sh` to confirm `dist/server/index.js` exports an ESM
  `default.fetch(request, env, ctx)` and `dist/.openai/hosting.json` is valid JSON.
- `npm run dev` / `npm run start` — Vite/vinext dev server / start the built app.
- `npm test` — build, validate the artifact, then run `tests/rendered-html.test.mjs`
  (`node --test`) which imports the built worker directly and asserts the dev-preview `<meta>`
  tag renders.
- `npm run validate:artifact` — re-run just the artifact validation step against an existing
  `dist/`, without rebuilding.
- `npm run db:generate` — generate Drizzle migrations from `db/schema.ts` into `./drizzle`.

Timeouts are overridable via `SITES_INSTALL_TIMEOUT`, `SITES_INSTALL_KILL_AFTER`,
`SITES_BUILD_TIMEOUT`, `SITES_BUILD_KILL_AFTER`. Install/build helpers never retry — they fail
fast on timeout. Only use `build`/`validate:artifact` for targeted diagnosis after a failure;
the platform's own checkpoint flow already runs install and build, so don't repeat them as a
routine pre-checkpoint step.

To run a single test file directly (after a build has produced `dist/`):
`node --test tests/rendered-html.test.mjs`.

## Architecture

**Routing/rendering**: This is effectively a single-page app. `app/layout.tsx` is the root
layout (fonts, metadata, global mascot overlay); `app/page.tsx` is the one real route and owns
almost all top-level state (`started`, `language`, `group`, `selected`, the Letters modal
open/stage state, audio playback state). Each major section of the page is its own client
component imported into `page.tsx`:

- `opening-screen.tsx` — pre-"start" landing/language-pick screen.
- `story-garden.tsx` — bilingual story reader (`stories` array with `Telugu`/`Hindi` variants
  per story, each with `pages`, `moral`, `question`, optional per-page `audio`).
- `akshara-builder.tsx` — Guninthalu tool: combine a consonant + vowel sign into a syllable.
- `math-corner.tsx` — arithmetic practice, localized operation labels.
- `more-games.tsx` — additional in-React games (e.g. `MemoryGame`), using `localStorage` for
  best-score persistence (`basha-match-best-<theme>` keys).
- `mascot-buddies.tsx` — floating SVG mascot characters (Vageesh, Vani), rendered once in the
  root layout so they persist across all sections.
- The "Parrot Letter Balloon Pop" game (`BubblePopGame` in `page.tsx`) is **not** a React
  component — it embeds `public/pop-letter.html` (a self-contained vanilla HTML/CSS/JS game) via
  `<iframe>`. Follow that pattern for new standalone mini-games rather than porting them to React.

**Language/content model**: Telugu and Hindi content is hand-authored as parallel data
structures (`Record<"Telugu" | "Hindi", ...>`) directly in each component file — there is no
i18n framework or external content store. Vowel/consonant letter sets, example words, morals,
etc. all live inline near the component that renders them. When adding letters/words/stories,
follow the existing per-language object shape in the relevant file rather than introducing a
new data layer.

Audio clips are referenced by convention-based paths (e.g. `/audio/telugu-amma.wav`,
`/audio/stories/lion-mouse-hindi-1.wav`) but the actual audio files are not all present; UI
code treats a missing/failing clip as a normal `"error"` state (see `audioState` handling in
`page.tsx` and the "Recording needed" fallback), not an exception.

**Cloudflare/vinext plumbing** (rarely needs touching):
- `worker/index.ts` — the actual Cloudflare Worker entry point. Intercepts `/_vinext/image` for
  image optimization (via the `IMAGES` binding) and otherwise delegates to vinext's
  `app-router-entry` handler.
- `db/index.ts` — `getDb()` wraps the `DB` D1 binding with Drizzle; throws if the binding isn't
  configured. `db/schema.ts` is intentionally empty by default (this app doesn't currently use
  a database) — see `examples/d1/` for an opt-in example schema/route to copy from if that
  changes.
- `vite.config.ts` — reads `.openai/hosting.json` to conditionally wire D1/R2 bindings for local
  dev via `@cloudflare/vite-plugin` + Miniflare, and applies an FSEvents-polling workaround
  under the Codex macOS Seatbelt sandbox.
- `build/sites-vite-plugin.ts` — a Vite plugin (`sites()`) that runs after build to copy
  `.openai/hosting.json` and `./drizzle` migrations into `dist/.openai/`.
- `app/chatgpt-auth.ts` — optional helpers for "Sign in with ChatGPT" (`getChatGPTUser`,
  `requireChatGPTUser`, `chatGPTSignInPath`/`chatGPTSignOutPath`). Identity comes from
  `oai-authenticated-user-email`/`-full-name` request headers injected by the platform's
  dispatch layer, which also owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, and
  `/callback` — don't implement app routes at those paths. SIWC proves identity, not workspace
  membership; add explicit server-side checks for anything that needs the latter. Mark pages
  that call these helpers with `export const dynamic = "force-dynamic"`.

## Conventions

- Every interactive component is a client component (`"use client"`); this app currently has no
  server components beyond the root layout/page shell.
- CSS is one hand-written stylesheet per feature area (e.g. `story-garden.css`,
  `akshara-builder.css`, `math-corner.css`), imported directly by its component — no CSS
  modules, no utility framework.
- No test framework beyond Node's built-in `node:test`; `tests/` only covers the built worker's
  HTML output, not component-level UI logic.
