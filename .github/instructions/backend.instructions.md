---
applyTo: "strapi/**"
---

# CMS Strapi (`@openg7/strapi`)

Ce fichier est un pointeur, pas une copie. Les règles complètes vivent dans [`AGENTS.md`](../../AGENTS.md) — les consulter avant d'écrire du code.

- Seeds (fichiers, ordre, rôles) : `AGENTS.md`, section « 5) Strapi — Seeds (fichiers & rôles) » (ligne 660).
- Principes de seed (idempotence, sécurité prod, localisation FR/EN) : `AGENTS.md`, section 5.1 (ligne 700).
- Variables d'environnement requises (`STRAPI_ADMIN_EMAIL/PASSWORD`, `STRAPI_SEED_ADMIN_ALLOWED`, `STRAPI_API_READONLY_TOKEN`) : `AGENTS.md`, section 5.2 (ligne 715).
- Contrat Front ↔ CMS, CORS, RBAC UI/API : `AGENTS.md`, section « Séparation Front (Angular) vs CMS (Strapi) » (ligne 868).
- Fichiers JSON de schémas et composants chargés par Strapi : `AGENTS.md`, ligne 1071.

Rappels non négociables :

- Strapi reste autoritaire pour la persistance, la validation, le contrôle d'accès et le cycle de vie des contenus — jamais l'inverse.
- Un admin initial ou des tokens ne s'écrivent jamais en production sans variable d'environnement explicite.
- Tout contenu textuel seedé doit exister en `fr` et `en`.
