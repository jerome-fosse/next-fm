# TODO

## Refactoring

- [x] Ajouter `startTransition` partout où une action appelle un service externe (API, storage, etc.) — déjà en place partout où c'est approprié
- [x] Extraire le `useState` de `dashboard/layout.tsx` dans un petit composant client dédié, pour remettre le layout en Server Component et permettre à `OptionsMenu` d'être un composant async Server (fetch Last.fm sans latence client)
- [x] Déplacer `secondsToDisplayTime` hors des mappers — fonction utilitaire de formatage utilisée directement par l'UI (`album-details.tsx`), ne devrait pas vivre dans `app/lib/mapper/`
- [ ] Remplacer les scripts manuels `test/example.ts` dans les clients HTTP par de vrais tests unitaires
