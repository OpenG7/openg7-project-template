# Inventaire des workflows

Ce dépôt est un modèle de gouvernance, pas une application buildable (voir [`README.md`](../../README.md)). Les 11 workflows hérités du produit ont été audités pour distinguer ce qui est réellement exécutable ici de ce qui appartient aux dépôts produits qui consomment ce template (par exemple `openg7-nexus`, sans que ce soit le seul possible). État actuel : 7 workflows actifs (dont deux propres au template), 6 supprimés.

Constat transversal : `package.json`, `yarn.lock` et `.nvmrc` racine n'existent pas dans ce dépôt, pas plus que les workspaces `openg7-org`, `strapi`, `packages/contracts`, `packages/tooling` qu'ils référençaient. Tout workflow qui suppose leur présence échouera tel quel dans ce dépôt.

## A — Validations applicables au dépôt template

Aucun des 11 workflows hérités ne rentrait dans cette catégorie tel quel : ils validaient tous du code produit (Angular/Strapi) qui n'existe pas ici.

| Workflow | Déclencheur | Ce qu'il valide |
| --- | --- | --- |
| `template-quality.yml` | `pull_request`, `push: main` | Exécute `node scripts/check-project-standards.mjs` : présence de `README.md`/`AGENTS.md`/`ARCHITECTURE.md`, sections obligatoires d'`AGENTS.md`, frontmatter des `.github/instructions/*.instructions.md` et des `.agents/skills/*/SKILL.md`, dérive des pointeurs `(ligne N)` vers `AGENTS.md`, liens Markdown locaux morts. |

Ce script a déjà détecté et permis de corriger deux liens croisés cassés entre `AGENTS.md` et `docs/ARCHITECTURE.md` hérités du commit initial.

## B — Workflows génériques réutilisables (actifs, généralisés)

| Workflow | Pattern | État |
| --- | --- | --- |
| `claude-pr.yml` | `workflow_dispatch` → agent IA scopé → PR automatique | ✅ Généralisé. Le `scope` est maintenant un champ texte libre (`repository-root` par défaut) au lieu d'un menu câblé sur `openg7-org`/`strapi`/`packages-*`. L'installation des dépendances détecte le gestionnaire de paquets et se saute proprement si aucun lockfile n'est présent. |
| `codex-pr.yml` | Même pattern (Codex) | ✅ Généralisé, même changement que `claude-pr.yml`. |
| `gemini-pr.yml` | Même pattern (Gemini) | ✅ Généralisé, même changement que `claude-pr.yml`. |
| `copilot-pr.yml` | Placeholder qui échoue intentionnellement (aucun runner Copilot stable disponible) | ✅ `scope` généralisé pour cohérence ; le comportement (échec volontaire documenté) reste inchangé jusqu'à ce qu'un runner Copilot existe. |
| `ecosystem-guardrails.yml` | Détection de gestionnaire de paquets (yarn/pnpm/npm/aucun), skip gracieux si aucun lockfile | ✅ Généralisé. Il appelle toujours `node tools/check-ecosystem-boundaries.js`, script product-specific qui n'existe pas dans ce template — mais une étape vérifie désormais sa présence et saute proprement l'exécution s'il est absent, au lieu d'échouer. Le template ne fournit volontairement pas de contenu pour ce script (analyser les frontières réelles d'un import graph TypeScript exige de connaître la structure réelle du projet consommateur) ; il s'active automatiquement dès qu'un dépôt cloné depuis ce template ajoute son propre `tools/check-ecosystem-boundaries.js`. |
| `sync-standards.yml` | `workflow_dispatch` uniquement → sync cross-repo → PR dans le dépôt cible | 🔒 Placeholder gardé, même logique que `copilot-pr.yml`. Le dépôt cible (`owner/repo`) est un input obligatoire sans valeur par défaut — aucun dépôt n'est privilégié. Échoue explicitement tant que le secret `STANDARDS_SYNC_TOKEN` (accès `contents:write` + `pull-requests:write` sur le dépôt cible) n'est pas configuré. Une fois le secret ajouté : détecte la dérive via `sync-openg7-standards.mjs --check`, applique le contrat de gouvernance dans une copie du dépôt cible, ouvre une PR en brouillon par défaut. Jamais déclenché automatiquement sur push. |

Ces quatre workflows de dispatch (`claude-pr`, `codex-pr`, `gemini-pr`, `copilot-pr`) sont désormais utilisables tels quels sur ce dépôt (scope par défaut = dépôt entier) et servent de patron à copier vers les nouveaux projets, où le `scope` peut être renseigné librement selon leur propre structure.

## C — Workflows propres à une stack ou à un produit (supprimés de ce dépôt)

Ces six workflows ont été retirés de `.github/workflows/` : ils n'avaient aucune action possible ici (scripts, workspaces et secrets Strapi/Angular absents du template). Ils restent documentés ici pour être recréés dans le dépôt produit concerné (`openg7-nexus` au moment de cet audit), où leurs dépendances existent réellement.

| Workflow (supprimé) | Déclencheur | Pourquoi il était product-specific |
| --- | --- | --- |
| `ci-validate.yml` | `pull_request`, `push: main` | Lint/build complet Angular+Strapi (`yarn prebuild:web`, `yarn --cwd openg7-org build:preprod`, tests d'intégration `strapi`, sélecteurs Playwright). |
| `checklist-audit.yml` | Cron (lundi/jeudi 06:00 UTC) | Vérifie `openg7-org/CHECKLIST.md` via `yarn sync:checklist`. |
| `pr-admin-quality-review.yml` | `pull_request` | Résout l'impact sur la matrice qualité admin, poste un commentaire de PR ; dépend de scripts et de données Strapi. |
| `admin-quality-matrix-sync.yml` | `push: main` | Publie un signal de fusion vers un endpoint d'ingestion Strapi. |
| `sync-admin-quality-matrix-export.yml` | Cron (lundi 06:00 UTC), `workflow_dispatch` | Exporte la matrice qualité depuis la base Strapi et commit `openg7-org/src/assets/data/admin-quality-matrix.json`. |
| `predeploy.yml` | `workflow_dispatch` | Valide la config runtime, provisionne un service Postgres, seed le CMS Strapi — readiness de déploiement produit. |

Leur contenu original reste consultable dans l'historique git de ce dépôt (avant leur suppression) pour servir de base à leur recréation dans le dépôt produit concerné.

## Synchronisation vers les dépôts produits

Deux façons d'appliquer le contrat de gouvernance à un dépôt cible — aucune des deux ne présuppose un nom de dépôt particulier :

- **Locale** : `node scripts/sync-openg7-standards.mjs --target <chemin>` (voir [`README.md`](../../README.md)) contre une copie locale du dépôt cible. Ne nécessite aucun secret.
- **Cross-repo** : `sync-standards.yml`, déclenché manuellement avec le dépôt cible (`owner/repo`) en paramètre obligatoire, ouvre une PR directement dedans. Nécessite le secret `STANDARDS_SYNC_TOKEN` — tant qu'il n'est pas configuré, le workflow échoue explicitement avec les instructions d'activation dans son résumé, sans jamais s'exécuter automatiquement.

## Prochaine étape

Aucun point restant identifié pour l'instant. À surveiller : lors de la première PR de sync ouverte dans un dépôt produit, vérifier que les fichiers copiés (notamment les workflows de dispatch agent) ne heurtent pas des fichiers du même nom déjà personnalisés là-bas.

_Dernière révision : 2026-07-18_
