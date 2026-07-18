## Résumé

Décrire le changement et pourquoi il est nécessaire.

## Type de changement

- [ ] Gouvernance du template (`AGENTS.md`, `ARCHITECTURE.md`, `.github/`)
- [ ] Code produit dans un dépôt cloné depuis ce template (Angular, Strapi, contrats, infra)
- [ ] Autre (préciser)

## Checklist — gouvernance du template

À cocher pour tout changement touchant `AGENTS.md`, `ARCHITECTURE.md` ou `.github/`.

- [ ] Si `AGENTS.md` et `ARCHITECTURE.md` divergent à cause de ce changement, les deux sont corrigés dans cette même PR (règle 3 d'`AGENTS.md`).
- [ ] Les registres concernés (sélecteurs `og7-*`, hooks `[data-og7*]`, autres) sont à jour.
- [ ] La documentation bilingue FR/EN reste synchronisée quand le fichier édité est bilingue.
- [ ] Aucune règle n'a été supprimée sans vérifier les scripts, tests ou workflows qui s'y rattachent.

## Checklist — Definition of Done (composant ou surface UI)

À cocher uniquement si cette PR ajoute ou modifie du code produit (voir `AGENTS.md`, section « Definition of Done »).

- [ ] Responsabilité unique et niveau UI (atome/molécule/organisme/template/page) identifiés.
- [ ] Portée métier et emplacement justifiés (`core` / `shared` / `domains`).
- [ ] Aucune dépendance interdite ni import privé entre domaines.
- [ ] États de chargement, vide, erreur, désactivé et accès refusé traités lorsque pertinents.
- [ ] Texte visible internationalisé ; clavier, focus et noms accessibles vérifiés.
- [ ] Compatible SSR ; aucun accès navigateur au chargement du module.
- [ ] Sélecteur `og7-*` et hooks `[data-og7*]` ajoutés au registre.
- [ ] Tests du niveau approprié ajoutés.

## Validations exécutées

Lister les commandes lancées et leur résultat. Documenter honnêtement toute validation qui n'a pas pu être exécutée (règle 8 d'`AGENTS.md`) plutôt que de l'omettre.

## Contexte additionnel

Captures d'écran, liens, notes pour les relecteurs.
