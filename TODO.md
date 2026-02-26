# TODO

## Refactoring

- [x] Ajouter `startTransition` partout où une action appelle un service externe (API, storage, etc.) — déjà en place partout où c'est approprié
- [x] Extraire le `useState` de `dashboard/layout.tsx` dans un petit composant client dédié, pour remettre le layout en Server Component et permettre à `OptionsMenu` d'être un composant async Server (fetch Last.fm sans latence client)
- [x] Déplacer `secondsToDisplayTime` hors des mappers — fonction utilitaire de formatage utilisée directement par l'UI (`album-details.tsx`), ne devrait pas vivre dans `app/lib/mapper/`
- [ ] Remplacer les scripts manuels `test/example.ts` dans les clients HTTP par de vrais tests unitaires
- [ ] Vérifier si `useSession` (`app/lib/utils/hooks/session.ts`) est encore utile — plus aucun import détecté, à supprimer si définitivement inutilisé

## fp-ts

- [ ] Remplacer les discriminated unions `{ error: true } | { error: false }` des actions par `Either<string, T>`
- [ ] Remplacer le pattern `cache.has() + cache.get()!` par `O.fromNullable(cache.get(key))` dans les services Discogs et Last.fm
- [ ] Utiliser `Option.fromNullable` + `pipe` dans les mappers pour remplacer les chaînes de `?.` et `?? defaultValue`
- [ ] Remplacer les chaînages `.then().catch()` dans les services par des pipelines fp-ts déclaratifs
- [ ] Migrer les appels HTTP async vers `TaskEither<Error, T>` dans les services
