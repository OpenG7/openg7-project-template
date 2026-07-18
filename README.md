# OpenG7 — Project Template

**Languages:** [Français](#francais) | [English](#english)

<a id="francais"></a>

## Ce que ce dépôt est — et n'est pas

`openg7-project-template` est le **modèle officiel de gouvernance** utilisé pour démarrer les nouveaux projets de l'écosystème OpenG7. Il ne contient pas d'application buildable : pas de front Angular, pas de CMS Strapi, pas de code produit. Il contient les **standards partagés** que chaque projet OpenG7 doit adopter dès sa création :

- [`AGENTS.md`](./AGENTS.md) — le règlement d'exécution pour les agents IA et les contributeurs humains (registres de sélecteurs, Definition of Done, checklists par domaine).
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — les principes architecturaux durables (frontières des workspaces, direction des dépendances, conventions Atomic Design).
- [`.github/`](./.github/) — l'outillage GitHub commun : templates d'issues et de pull requests, instructions Copilot scopées, workflows CI génériques et réutilisables.

Le produit lui-même (front Angular, CMS Strapi, contrats partagés, scripts d'infra) vit dans les dépôts applicatifs, notamment [`openg7-nexus`](https://github.com/openg7/openg7-nexus). Ce gabarit sert de source de vérité pour leurs règles, pas de copie exécutable de leur code.

## Comment l'utiliser

1. Créer un nouveau dépôt à partir de ce modèle (bouton **Use this template** sur GitHub).
2. Adapter `AGENTS.md` et `ARCHITECTURE.md` uniquement si le nouveau projet s'écarte volontairement des standards OpenG7 — documenter l'écart plutôt que de le laisser implicite.
3. Garder les deux documents synchronisés : toute divergence entre eux doit être corrigée dans la même pull request (voir la règle 3 d'`AGENTS.md`).
4. Consulter `.github/workflows/README.md` avant d'activer un workflow : certains sont génériques et réutilisables tels quels, d'autres sont propres à la stack Angular/Strapi et doivent être adaptés ou déplacés vers le dépôt produit.

## Structure

```text
openg7-project-template/
├─ AGENTS.md                       # Règles exécutables pour agents et contributeurs
├─ README.md                       # Ce document
├─ docs/
│  └─ ARCHITECTURE.md              # Principes architecturaux durables
└─ .github/
   ├─ copilot-instructions.md      # Point d'entrée Copilot, renvoie vers AGENTS.md
   ├─ instructions/                # Instructions Copilot scopées par domaine
   ├─ ISSUE_TEMPLATE/
   ├─ pull_request_template.md
   └─ workflows/                   # CI — voir workflows/README.md pour le statut de chacun
```

## Support multi-agents

Ce modèle est conçu pour être exploité par plusieurs agents IA (Claude, Codex, Gemini, GitHub Copilot). Chacun lit `AGENTS.md` comme source de vérité commune ; les fichiers `.github/instructions/*.instructions.md` fournissent en complément des points d'entrée scopés pour Copilot, sans dupliquer le contenu d'`AGENTS.md`.

---

<a id="english"></a>

## What this repository is — and isn't

`openg7-project-template` is the **official governance template** used to bootstrap new projects in the OpenG7 ecosystem. It does not contain a buildable application: no Angular front-end, no Strapi CMS, no product code. It contains the **shared standards** every OpenG7 project must adopt from day one:

- [`AGENTS.md`](./AGENTS.md) — the executable rulebook for AI agents and human contributors (selector registries, Definition of Done, per-domain checklists).
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — durable architectural principles (workspace boundaries, dependency direction, Atomic Design conventions).
- [`.github/`](./.github/) — shared GitHub tooling: issue and pull request templates, scoped Copilot instructions, generic and reusable CI workflows.

The actual product (Angular front-end, Strapi CMS, shared contracts, infra scripts) lives in application repositories, notably [`openg7-nexus`](https://github.com/openg7/openg7-nexus). This template is the source of truth for their rules, not an executable copy of their code.

## How to use it

1. Create a new repository from this template (**Use this template** button on GitHub).
2. Only adapt `AGENTS.md` and `ARCHITECTURE.md` when the new project deliberately diverges from OpenG7 standards — document the divergence instead of leaving it implicit.
3. Keep both documents in sync: any divergence between them must be fixed in the same pull request (see rule 3 in `AGENTS.md`).
4. Check `.github/workflows/README.md` before enabling a workflow: some are generic and reusable as-is, others are specific to the Angular/Strapi stack and must be adapted or moved to the product repository.

## Multi-agent support

This template is designed to be used by several AI agents (Claude, Codex, Gemini, GitHub Copilot). Each reads `AGENTS.md` as the common source of truth; `.github/instructions/*.instructions.md` files provide scoped entry points for Copilot on top of that, without duplicating `AGENTS.md` content.

---

_Last updated / Dernière mise à jour : 2026-07-18_
