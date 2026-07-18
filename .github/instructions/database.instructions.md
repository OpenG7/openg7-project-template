---
applyTo: "strapi/**/content-types/**,strapi/**/seed/**,strapi/**/schema.json"
---

# Schémas et données Strapi

Ce fichier est un pointeur, pas une copie. Les règles complètes vivent dans [`AGENTS.md`](../../AGENTS.md) — les consulter avant de modifier un schéma ou un seed.

- Contraintes et index des schémas de content-types : `AGENTS.md`, section « Strapi — Schémas : contraintes et index » (ligne 1624).
- Helpers de seed idempotents (`upsertByUID`, `ensureLocale`) et leur usage : `AGENTS.md`, section « Seeds Strapi — helpers idempotents et locales » (ligne 1657).
- Principes de seed (idempotence, sécurité prod, localisation) : `AGENTS.md`, section 5.1 (ligne 700).

Rappels non négociables :

- Toute relation, contrainte `unique`/`required` ou index doit être justifiée par un cas d'usage réel documenté dans le schéma ou la PR.
- Les champs sensibles utilisent `"private": true` plutôt qu'une convention de nommage.
- Les seeds utilisent toujours `upsert` par clé stable (`slug` ou équivalent) — jamais de création inconditionnelle.
