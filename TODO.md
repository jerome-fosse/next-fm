# TODO

| # | Fait | Type | Priorité | Catégorie | Description |
|---|------|------|----------|-----------|-------------|
| 1 | ✅ | Refacto | 🟡 NORMALE | Architecture | Ajouter `startTransition` partout où une action appelle un service externe (API, storage, etc.) |
| 2 | ✅ | Refacto | 🟡 NORMALE | Architecture | Extraire le `useState` de `dashboard/layout.tsx` dans un composant client dédié pour remettre le layout en Server Component |
| 3 | ✅ | Refacto | 🟡 NORMALE | Architecture | Déplacer `secondsToDisplayTime` hors des mappers vers `app/lib/utils/duration.ts` |
| 4 | ☐ | Refacto | 🔴 HAUTE | Tests | Remplacer les scripts manuels `test/example.ts` dans les clients HTTP par de vrais tests unitaires |
| 5 | ☐ | Refacto | 🔴 HAUTE | Architecture | Vérifier si `useSession` (`app/lib/utils/hooks/session.ts`) est encore utile — plus aucun import détecté |
| 6 | ☐ | Feat. | 🔴 HAUTE | UX | Ajouter une animation de chargement (spinner) ou utiliser `<Suspense>` lors du chargement d'une nouvelle page de résultats |
| 7 | ☐ | Refacto | 🟡 NORMALE | fp-ts | Remplacer les discriminated unions `{ error: true } \| { error: false }` des actions par `Either<string, T>` |
| 8 | ☐ | Refacto | 🟢 BASSE | fp-ts | Remplacer le pattern `cache.has() + cache.get()!` par `O.fromNullable(cache.get(key))` dans les services Discogs et Last.fm |
| 9 | ☐ | Refacto | 🟢 BASSE | fp-ts | Utiliser `Option.fromNullable` + `pipe` dans les mappers pour remplacer les chaînes de `?.` et `?? defaultValue` |
| 10 | ☐ | Refacto | 🟡 NORMALE | fp-ts | Remplacer les chaînages `.then().catch()` dans les services par des pipelines fp-ts déclaratifs |
| 11 | ☐ | Refacto | 🔴 HAUTE | fp-ts | Migrer les appels HTTP async vers `TaskEither<Error, T>` dans les services |
