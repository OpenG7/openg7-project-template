---
applyTo: "**/*.md"
---

# Documentation (`AGENTS.md`, `ARCHITECTURE.md`, guides)

Ce fichier est un pointeur, pas une copie. Les règles complètes vivent dans [`AGENTS.md`](../../AGENTS.md) — les consulter avant de modifier un document.

- Règle de maintenance d'`AGENTS.md` : `AGENTS.md`, section « Maintenance de ce document » (ligne 1955).
- Répartition des responsabilités entre les deux documents : `ARCHITECTURE.md` explique *pourquoi et où* (principes durables) ; `AGENTS.md` explique *comment* (règles exécutables, registres, checklists).
- Critères déclenchant une mise à jour d'architecture : `ARCHITECTURE.md`, section « Architecture Evolution » / « Évolution de l'architecture ».

Rappels non négociables :

- `AGENTS.md` et `ARCHITECTURE.md` sont bilingues (EN/FR) ; toute section modifiée dans une langue doit être répercutée dans l'autre, dans la même PR.
- En cas de divergence entre les deux documents, corriger les deux dans la même pull request plutôt que d'introduire une exception silencieuse.
- Ne jamais supprimer une règle sans vérifier les scripts, tests ou workflows qui s'y rattachent.
