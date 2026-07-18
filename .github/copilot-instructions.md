# Instructions pour GitHub Copilot

Ce dépôt est le modèle de gouvernance OpenG7. Avant de proposer du code ou de la documentation, lire :

1. [`AGENTS.md`](../AGENTS.md) — règles exécutables, registres de sélecteurs, Definition of Done, checklists par domaine. C'est la source de vérité ; ne pas réécrire ces règles ailleurs.
2. [`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md) — principes durables, frontières des workspaces, direction des dépendances.

## Règles non négociables (résumé — voir `AGENTS.md` section « Règles non négociables pour les agents » pour le détail)

- Rechercher une implémentation équivalente avant de créer un fichier ; ne pas inventer un nouveau pattern quand un composant, contrat ou hook stable existe déjà.
- Respecter les frontières `core` / `shared` / `domains` / `packages` : le code partagé n'importe jamais un domaine, une primitive ne dépend jamais d'une page ou d'un client API.
- Ne jamais utiliser une classe Tailwind comme sélecteur stable de test ; utiliser les sélecteurs `og7-*` et hooks `[data-og7*]` du registre.
- Mettre à jour le registre des sélecteurs, les tests et la documentation dans le même changement.
- Ne jamais traiter un guard ou un masquage UI Angular comme une mesure de sécurité serveur — Strapi reste autoritaire.
- Ce dépôt lui-même ne contient pas de code applicatif buildable : ne pas générer de code Angular/Strapi ici, seulement de la documentation et de l'outillage de gouvernance.

## Instructions scopées

Des instructions plus précises, activées automatiquement selon le fichier édité, se trouvent dans [`.github/instructions/`](./instructions/) :

- `angular.instructions.md` — conventions front (composants, guards, routage, i18n).
- `backend.instructions.md` — conventions Strapi (seeds, variables d'environnement, contrat front/CMS).
- `database.instructions.md` — schémas et contraintes Strapi.
- `documentation.instructions.md` — règles de maintenance des documents FR/EN.

Ces fichiers pointent vers des sections précises d'`AGENTS.md` plutôt que de dupliquer leur contenu. En cas de doute, `AGENTS.md` fait foi.
