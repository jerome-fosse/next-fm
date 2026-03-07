# TODO

| #  | Fait | Type | Priorité | Catégorie | Description |
|----|------|------|----------|-----------|-------------|
| 1  | ✅ | Refacto | 🟡 NORMALE | Architecture | Ajouter `startTransition` partout où une action appelle un service externe (API, storage, etc.) |
| 2  | ✅ | Refacto | 🟡 NORMALE | Architecture | Extraire le `useState` de `dashboard/layout.tsx` dans un composant client dédié pour remettre le layout en Server Component |
| 3  | ✅ | Refacto | 🟡 NORMALE | Architecture | Déplacer `secondsToDisplayTime` hors des mappers vers `app/lib/utils/duration.ts` |
| 4  | ✅ | Refacto | 🔴 HAUTE | Tests | Remplacer les scripts manuels `test/example.ts` dans les clients HTTP par de vrais tests unitaires |
| 5  | ☐ | Refacto | 🔴 HAUTE | Architecture | Vérifier si `useSession` (`app/lib/utils/hooks/session.ts`) est encore utile — plus aucun import détecté |
| 6  | ✅ | Feat. | 🔴 HAUTE | UX | Ajouter une animation de chargement (spinner) ou utiliser `<Suspense>` lors du chargement d'une nouvelle page de résultats |
