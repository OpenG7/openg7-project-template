# Inventaire des workflows

Ce dépôt est un modèle de gouvernance, pas une application buildable (voir [`README.md`](../../README.md)). Les 11 workflows hérités du produit ont été audités pour distinguer ce qui est réellement exécutable ici de ce qui appartient au(x) dépôt(s) produit (`openg7-nexus`). État actuel après audit : 5 workflows actifs, 6 supprimés.

Constat transversal : `package.json`, `yarn.lock` et `.nvmrc` racine n'existent pas dans ce dépôt, pas plus que les workspaces `openg7-org`, `strapi`, `packages/contracts`, `packages/tooling` qu'ils référençaient. Tout workflow qui suppose leur présence échouera tel quel dans ce dépôt.

## A — Validations applicables au dépôt template

Aucun des 11 workflows hérités ne rentre dans cette catégorie tel quel : ils valident tous du code produit (Angular/Strapi) qui n'existe pas ici. Ce qui manque encore et reste à créer :

- Validation de structure des registres dans `AGENTS.md` (tables de sélecteurs bien formées, tags `[ui: ...] [scope: ...]`).
- Validation des fichiers `.github/instructions/*.instructions.md` (frontmatter `applyTo` présent, ancre de ligne valide vers `AGENTS.md`).
- Lint Markdown / liens morts sur `AGENTS.md`, `ARCHITECTURE.md`, `README.md`.

## B — Workflows génériques réutilisables (actifs, généralisés)

| Workflow | Pattern | État |
| --- | --- | --- |
| `claude-pr.yml` | `workflow_dispatch` → agent IA scopé → PR automatique | ✅ Généralisé. Le `scope` est maintenant un champ texte libre (`repository-root` par défaut) au lieu d'un menu câblé sur `openg7-org`/`strapi`/`packages-*`. L'installation des dépendances détecte le gestionnaire de paquets et se saute proprement si aucun lockfile n'est présent. |
| `codex-pr.yml` | Même pattern (Codex) | ✅ Généralisé, même changement que `claude-pr.yml`. |
| `gemini-pr.yml` | Même pattern (Gemini) | ✅ Généralisé, même changement que `claude-pr.yml`. |
| `copilot-pr.yml` | Placeholder qui échoue intentionnellement (aucun runner Copilot stable disponible) | ✅ `scope` généralisé pour cohérence ; le comportement (échec volontaire documenté) reste inchangé jusqu'à ce qu'un runner Copilot existe. |
| `ecosystem-guardrails.yml` | Détection de gestionnaire de paquets (yarn/pnpm/npm/aucun), skip gracieux si aucun lockfile | ⚠️ Mécanisme générique et déjà tolérant à l'absence de lockfile, mais il appelle `node tools/check-ecosystem-boundaries.js`, script product-specific qui n'existe pas ici. Reste à traiter : écrire une version « template » de ce script (vérifie les frontières documentées dans `ARCHITECTURE.md`) ou retirer ce workflow d'ici. |

Ces quatre workflows de dispatch (`claude-pr`, `codex-pr`, `gemini-pr`, `copilot-pr`) sont désormais utilisables tels quels sur ce dépôt (scope par défaut = dépôt entier) et servent de patron à copier vers les nouveaux projets, où le `scope` peut être renseigné librement selon leur propre structure.

## C — Workflows propres à une stack ou à un produit (supprimés de ce dépôt)

Ces six workflows ont été retirés de `.github/workflows/` : ils n'avaient aucune action possible ici (scripts, workspaces et secrets Strapi/Angular absents du template). Ils restent documentés ici pour être recréés dans `openg7-nexus`, où leurs dépendances existent réellement.

| Workflow (supprimé) | Déclencheur | Pourquoi il était product-specific |
| --- | --- | --- |
| `ci-validate.yml` | `pull_request`, `push: main` | Lint/build complet Angular+Strapi (`yarn prebuild:web`, `yarn --cwd openg7-org build:preprod`, tests d'intégration `strapi`, sélecteurs Playwright). |
| `checklist-audit.yml` | Cron (lundi/jeudi 06:00 UTC) | Vérifie `openg7-org/CHECKLIST.md` via `yarn sync:checklist`. |
| `pr-admin-quality-review.yml` | `pull_request` | Résout l'impact sur la matrice qualité admin, poste un commentaire de PR ; dépend de scripts et de données Strapi. |
| `admin-quality-matrix-sync.yml` | `push: main` | Publie un signal de fusion vers un endpoint d'ingestion Strapi. |
| `sync-admin-quality-matrix-export.yml` | Cron (lundi 06:00 UTC), `workflow_dispatch` | Exporte la matrice qualité depuis la base Strapi et commit `openg7-org/src/assets/data/admin-quality-matrix.json`. |
| `predeploy.yml` | `workflow_dispatch` | Valide la config runtime, provisionne un service Postgres, seed le CMS Strapi — readiness de déploiement produit. |

Leur contenu original reste consultable dans l'historique git de ce dépôt (avant leur suppression) pour servir de base à leur recréation dans `openg7-nexus`.

## Prochaine étape

Catégorie A (validations propres au template : structure des registres `AGENTS.md`, validation des `.instructions.md`, lint Markdown) reste à construire — aucun workflow existant ne la couvre encore.

_Dernière révision : 2026-07-18_
