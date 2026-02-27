# CLAUDE.md


## Key Patterns

- **`useEffect`** uniquement pour les APIs navigateur (cookies, localStorage, window) — pas pour le data fetching.
- **`startTransition`** dans les event handlers qui appellent une Server Action ou une opération async coûteuse.
- **Zod** validates all incoming data: form inputs, configuration, API responses, files.
- **Server Components** par défaut, `'use client'` poussé le plus bas possible dans l'arbre.
- **Slot pattern** pour passer des Server Components à travers des Client Components.
- **Storage** configuré via les variables d'environnement `STORAGE_*` (voir `.env.development`).
- **Pattern matching** avec `ts-pattern` à la place des `if/else` ou `switch/case` quand ça fait du sens.
- **Promises** `.then()/.catch()` plutôt que des blocs `try/catch` pour la gestion des appels asynchrones.
