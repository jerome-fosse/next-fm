# CLAUDE.md

## General Principles

- **KISS**: always prefer the simplest solution. Complexity is only justified when a simple solution is insufficient.
- **Think twice**: once a solution is found, challenge it to find a simpler one before applying it.
- **TypeScript/Next.js**: use modern React patterns. Avoid deprecated APIs (no `forwardRef`). Prefer Server Components where possible.
- **Approach**: before making any changes, explain your approach in 3-4 bullet points — including which files you'll change and why.

## Key Patterns

- **`useEffect`** only for browser APIs (cookies, localStorage, window) — not for data fetching.
- **`startTransition`** in event handlers that call a Server Action or an expensive async operation.
- **Zod** validates all incoming data: form inputs, configuration, API responses, files.
- **Server Components** by default, `'use client'` pushed as low as possible in the tree.
- **Slot pattern** to pass Server Components through Client Components.
- **Storage** configured via `STORAGE_*` environment variables (see `.env.development`).
- **Pattern matching** with `ts-pattern` instead of `if/else` or `switch/case` when it makes sense.
- **Promises** `.then()/.catch()` rather than `try/catch` blocks for async calls.
