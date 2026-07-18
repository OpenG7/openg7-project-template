---
applyTo: "openg7-org/**"
---

# Front Angular (`@openg7/web`)

Ce fichier est un pointeur, pas une copie. Les règles complètes vivent dans [`AGENTS.md`](../../AGENTS.md) — les consulter avant d'écrire du code.

- Composition UI et Atomic Design adapté à OpenG7 : `AGENTS.md`, section « Composition UI — Atomic Design adapté à OpenG7 » (ligne 22) et sa Definition of Done (ligne 104).
- Registre des sélecteurs Angular `og7-*` et hooks `[data-og7*]` à tenir à jour pour tout composant stable : `AGENTS.md`, lignes 117 et 214.
- Sélecteurs HTML, nomenclature NgRx, guards/interceptors/services de sécurité, routage et SSR : `AGENTS.md`, sections 1 à 4 (lignes 317 à 656).
- Contrat Front ↔ CMS et responsabilités Do/Don't : `AGENTS.md`, section « Séparation Front (Angular) vs CMS (Strapi) » (ligne 868).
- Budgets non fonctionnels (SSR, cache, accessibilité carte/drawer) : `AGENTS.md`, section « NFR — Budgets et critères d'acceptation » (ligne 1472).

Rappels non négociables :

- Standalone, signal-first, i18n `@ngx-translate`, SSR-safe, Tailwind pour le style uniquement (jamais comme sélecteur de test).
- Aucun accès `window`/`document` au chargement de module.
- Un guard Angular améliore la navigation ; il ne sécurise jamais le serveur.
