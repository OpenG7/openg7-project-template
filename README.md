# OpenG7 Project Template

Modèle de gouvernance de l’écosystème OpenG7. Ce dépôt contient les standards,
leurs contrôles et leur synchronisation; aucune application produit.

## Sources

- [AGENTS.md](AGENTS.md) : mission, bloc commun, règles locales et lectures utiles.
- [Architecture](docs/ARCHITECTURE.md) : propriété des règles et propagation.
- [Standard](docs/standards/README.md) : budgets, portée et conventions de lecture.
- [Audit du 21 septembre 2026](docs/standards/audit-2026-09-21.md) : périmètre, migration et mesures avant/après.
- [Socle canonique](docs/standards/agent-common.md) : contenu identique inclus dans
  chaque AGENTS racine, sans lecture supplémentaire pendant une tâche ordinaire.
- [Procédures](.agents/skills/README.md) et [instructions Copilot](.github/copilot-instructions.md) :
  pointeurs courts, applicables uniquement à la stack réelle du projet.
- [Workflows](.github/workflows/README.md) : validation et automatisations disponibles.

## Créer un projet

1. Créer le dépôt depuis ce template.
2. Définir sa mission, son état réel et ses invariants locaux dans AGENTS.md;
   conserver le bloc commun entre ses marqueurs.
3. Adapter l’architecture et les références à cette mission. Aucun registre UI,
   fournisseur, chemin ou commande applicative ne s’hérite sans implémentation.
4. Ajouter des consignes locales seulement si leur chemin exige des règles propres.
5. Exécuter les contrôles ci-dessous; les validations applicatives viennent avec
   les manifests et le code réellement présents.

## Recettes facultatives

La [recette de gateway local](docs/recipes/local-gateway.md) propose un contrat
de démarrage, d’arrêt depuis un autre terminal et de récupération du routage.
Chaque projet adapte et livre son propre lanceur, sa configuration et ses tests.
Cette recette reste hors du socle et de sa synchronisation; elle n’ajoute aucun
script applicatif exécutable au template.

## Valider et synchroniser

```sh
node scripts/check-project-standards.mjs
node --test scripts/__tests__/standards.test.mjs
node scripts/sync-openg7-standards.mjs --target ../mon-projet --dry-run
node scripts/sync-openg7-standards.mjs --target ../mon-projet
node scripts/sync-openg7-standards.mjs --target ../mon-projet --check
```

Le [manifest](scripts/sync-manifest.json) gère uniquement le socle, son guide,
le validateur et son workflow CI. La synchronisation remplace le bloc commun
sans modifier le texte local autour, l’architecture, les skills ou les workflows
produit. Elle n’effectue ni commit, push, PR ni déploiement localement.

Un ancien AGENTS sans marqueurs exige d’abord une migration revue de sa mission.
Ne pas lui ajouter les marqueurs autour de tout son contenu : seul le socle commun
va à l’intérieur. Les sorties CLI distinguent succès (0), dérive en check (1),
et précondition/argument invalide (2). Une erreur de précondition bloque toute copie.

## English

This is OpenG7’s governance template, with no buildable product. Define each
repository’s mission and actual implementation state in its own AGENTS.md and
architecture. Keep the shared marked block identical; load detailed references
only when relevant. The sync command updates that block and explicitly managed
files while preserving local mission, architecture, skills and product workflows.
Run the validator and tool tests above. Check and dry-run modes never write.
Optional recipes, such as the [local gateway](docs/recipes/local-gateway.md),
require explicit project adoption and are outside standards synchronization.
