# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is kai

kai is a CLI tool that manages curated instruction sets (markdown files) for Claude Code projects. It fetches instruction files from a GitHub repository (`kodius/kai`), downloads them into a local `.kai/` directory, and wires them into `CLAUDE.md` via `@.kai/<filename>` import references inside a managed marker block (`<!-- kai:start -->` / `<!-- kai:end -->`).

## Commands

- `pnpm build` — build with tsup (outputs ESM bundle to `dist/index.js` with node shebang)
- `pnpm dev` — build in watch mode
- `pnpm test` — run all tests (vitest)
- `pnpm test:watch` — run tests in watch mode
- `pnpm typecheck` — type-check without emitting (`tsc --noEmit`)

Run a single test file: `pnpm vitest run tests/services/config.test.ts`

## Architecture

TypeScript CLI using Commander for argument parsing and @clack/prompts for interactive UI. Built with tsup targeting Node 18+ ESM.

### CLI commands (src/commands/)

- **default** — entry point; if no config exists runs `install`, otherwise prompts to install or update
- **install** — fetches manifest from GitHub, presents multiselect of instruction sets, downloads selected ones, updates config and CLAUDE.md
- **update** — re-downloads all currently installed instruction sets from the manifest
- **list** — displays available instruction sets grouped by category, marking installed ones

### Services (src/services/)

- **manifest** — fetches the remote `manifest.json` with spinner UX
- **instructions** — downloads instruction markdown files into `.kai/` directory
- **config** — reads/writes `.kai/config.json` (tracks installed instructions with ids, filenames, timestamps, source URLs); `mergeConfig` deduplicates by id
- **claude-md** — manages the marker-delimited block in `CLAUDE.md`; handles create, update (replace markers), and placement prompts (top/bottom/replace) for existing files

### Key files

- `manifest.json` — registry of available instruction sets (id, name, description, filename, category, tags)
- `instructions/` — the actual instruction markdown files served from this repo
- `.kai/config.json` — per-project install state (written to the user's project, not this repo)

### Data flow

`manifest.json` on GitHub -> fetch manifest -> user selects instructions -> download `.md` files to `.kai/` -> write `.kai/config.json` -> inject `@.kai/*.md` references into `CLAUDE.md` marker block

## Testing

Tests are in `tests/` mirroring `src/` structure. They test pure functions (config merging, block building, URL construction) — no network or filesystem mocking. Test globals (`describe`, `it`, `expect`) are enabled via vitest config.

## TypeScript

Strict mode with `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`. All imports use `.js` extensions for ESM compatibility.
