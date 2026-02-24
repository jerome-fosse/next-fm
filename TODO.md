# TODO

## Refactoring

- [x] Ajouter `startTransition` partout où une action appelle un service externe (API, storage, etc.) — déjà en place partout où c'est approprié
- [ ] Extraire le `useState` de `dashboard/layout.tsx` dans un petit composant client dédié, pour remettre le layout en Server Component et permettre à `OptionsMenu` d'être un composant async Server (fetch Last.fm sans latence client)
