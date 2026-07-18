**Languages:** [English](#english) | [Français](#francais)

<a id="english"></a>

# OpenG7 Monorepo Architecture

This document defines the durable architectural principles of the `openg7-nexus` repository. It describes workspace boundaries, dependency rules, front-end composition, CMS integration, build flows, and the conventions used to keep OpenG7 maintainable as the ecosystem grows.

`ARCHITECTURE.md` explains **why and where**. [`AGENTS.md`](./AGENTS.md) defines **how agents and contributors must execute the work**.

## Architectural Principles

1. **Domain-first organization**: business capabilities are grouped by domain rather than by technical file type.
2. **Explicit boundaries**: front-end, CMS, contracts, tooling, and infrastructure have separate responsibilities.
3. **Atomic Design as a composition taxonomy**: atoms, molecules, organisms, templates, and pages describe UI responsibility and complexity; they do not impose a repository-wide folder tree.
4. **Signals by default**: local and feature state should use Angular signals unless truly global state justifies NgRx.
5. **Server authority**: UI authorization and visibility never replace CMS/API permissions.
6. **Stable interfaces**: API contracts, Angular selectors, and `[data-og7*]` hooks are versioned integration surfaces.
7. **SSR-safe implementation**: browser-only APIs must be isolated and loaded only in a browser context.
8. **Accessible and internationalized by construction**: reusable UI must include keyboard behavior, semantic markup, and translation keys from its first implementation.

## Sources of Truth

| Concern | Source of truth |
| --- | --- |
| Durable architecture and dependency direction | `ARCHITECTURE.md` |
| Agent workflow, implementation rules, registries, and acceptance checks | `AGENTS.md` |
| Shared API schemas and generated clients | `packages/contracts` |
| CMS content models and server permissions | `strapi` |
| Stable UI and test selectors | Selector registries in `AGENTS.md` |
| Infrastructure and deployment manifests | `infra` and environment-specific documentation |

## Workspaces and Responsibilities

- **Front (`@openg7/web`)**: Angular 19 standalone/SSR application hosted in `openg7-org`, with runtime configuration, signals, i18n via `@ngx-translate`, and cartography integrations. The `start`, `build`, and `build:preprod` scripts orchestrate the Express SSR server and runtime configuration generation. 【F:openg7-org/package.json†L1-L41】
- **CMS (`@openg7/strapi`)**: Strapi v5 workspace responsible for content, idempotent seeds, administration, Postgres persistence, media storage, and server-side authorization. 【F:strapi/README.md†L8-L41】【F:strapi/README.md†L66-L87】
- **API contracts (`packages/contracts`)**: shared schemas and generated clients consumed by the front-end and CMS. Root `codegen` and test flows must run before a front-end release build. 【F:package.json†L1-L38】
- **Tooling (`@openg7/tooling`)**: cross-cutting validation utilities, including checks for `[data-og7]` selectors and other architectural guardrails. 【F:packages/tooling/package.json†L1-L15】
- **Infrastructure (`infra`)**: deployment manifests, runtime configuration, CI/CD assets, and environment-level concerns.

## Front-End Architecture

### Domain-first structure

The Angular application is organized around business domains. A domain owns its routed pages, feature orchestration, domain UI, and domain-specific data access.

```text
openg7-org/src/app/
├─ core/                      # Cross-cutting runtime infrastructure
│  ├─ auth/
│  ├─ config/
│  ├─ http/
│  ├─ observability/
│  ├─ security/
│  └─ ui/                    # Global infrastructure UI only (for example modal host)
├─ shared/                    # Reusable, business-neutral capabilities
│  ├─ ui/                    # Target convention for primitives/composites/patterns
│  │  ├─ primitives/
│  │  ├─ composites/
│  │  └─ patterns/
│  ├─ components/            # Existing shared components; migrate opportunistically
│  ├─ directives/
│  ├─ pipes/
│  └─ utilities/
└─ domains/
   └─ <domain>/
      ├─ pages/               # Routed entry points
      ├─ feature/             # Use-case orchestration and feature state
      ├─ ui/                  # Domain-owned presentational components
      ├─ data-access/         # Domain API clients, repositories, adapters
      └─ models/              # Domain-specific types when not shared contracts
```

The `shared/ui` folders are a **target convention**, not a requirement to perform a large migration. Existing `shared/components` paths remain valid until a component is materially changed or a dedicated migration is approved.

### Atomic Design adapted for OpenG7

Atomic Design classifies the responsibility of a component. Its classification is independent from its business scope.

| UI level | OpenG7 definition | Business logic | Typical examples | Typical placement |
| --- | --- | --- | --- | --- |
| **Atom** | Indivisible visual/control primitive | None | button, badge, icon, label, input shell | `shared/ui/primitives` |
| **Molecule** | Small composition of atoms with one focused interaction | None or minimal presentation state | search field, date range control, labeled input group | `shared/ui/composites` or domain `ui` |
| **Organism** | Complete reusable UI section composed of molecules | May contain presentation orchestration; no direct infrastructure coupling when avoidable | site header, feed card, map control panel | `shared/ui/patterns`, `shared/components`, or domain `ui` |
| **Template** | Page scaffold defining regions and responsive layout | No data fetching and no business decisions | admin shell, detail-page layout | domain `feature` or `layouts` when introduced |
| **Page** | Routed composition and use-case entry point | Yes: route state, loading, permissions, feature orchestration | feed detail page, profile page | `domains/<domain>/pages` |

Atomic Design does **not** create a global `atoms/molecules/organisms` tree for all domains. Placement is decided with two axes:

1. **Composition level**: atom, molecule, organism, template, or page.
2. **Scope**: global infrastructure, business-neutral shared UI, multidomain capability, or domain-owned UI.

### Placement rules

- Put a component in `shared` only when its API and meaning are business-neutral or when reuse in more than one real context is identified.
- Keep domain vocabulary and domain-specific behavior inside `domains/<domain>`.
- Do not move a component to `shared` only because future reuse seems possible.
- Keep direct API calls out of atoms and molecules.
- Pages coordinate route state, permissions, feature state, and data loading; large visual sections should be extracted.
- `core` must not depend on a business domain.
- One domain must not import another domain's private UI. Cross-domain capabilities must be promoted through an explicit shared contract or package.

### Dependency direction

```text
pages
  ↓
feature orchestration / templates
  ↓
domain organisms and domain UI
  ↓
shared patterns and composites
  ↓
shared primitives and design tokens
```

Dependencies must not point upward. Shared code cannot import domain code. UI primitives cannot depend on feature state, HTTP clients, or CMS contracts unless the primitive's public responsibility explicitly requires a neutral shared type.

### Component responsibilities

- **Presentational components** receive typed inputs and emit semantic outputs.
- **Feature components** translate application state into UI state and coordinate use cases.
- **Data-access code** communicates with APIs and maps transport models to domain models.
- **Pages** connect routing, permissions, analytics context, and feature orchestration.
- **Services** should represent infrastructure or domain capabilities, not serve as storage for arbitrary component state.

## Stable UI Interfaces

Angular selectors and `[data-og7*]` attributes are stable interfaces used by templates, tests, analytics, and automation.

- Angular component selectors use the `og7-` prefix and kebab-case.
- Test and automation hooks use `data-og7`, `data-og7-id`, or `data-og7-layer`.
- Tailwind classes are implementation details and must not be used as stable test selectors.
- Every new stable widget or action must be added to the selector registry in `AGENTS.md`.
- Renaming a stable selector requires updating templates, tooling, tests, and the registry in the same change.

## State Management

- Prefer local `signal`, `computed`, and `effect` for component and feature-local state.
- Use a dedicated feature store when multiple components coordinate a non-trivial use case.
- Use NgRx/global state only for genuinely cross-domain state such as authentication, the current user, shared catalog data, or global map state.
- Do not mirror server data in several independent stores without an explicit cache and invalidation strategy.

## Front ↔ CMS Contract

The Angular front-end consumes Strapi endpoints through generated or shared contracts. The CMS remains authoritative for persistence, validation, access control, and content lifecycle.

- Contract changes must update `packages/contracts`, consumers, tests, and documentation together.
- Angular UI guards improve navigation but do not provide server security.
- Strapi permissions and policies are mandatory for every protected operation.
- Seed data must be idempotent and environment-aware.
- Media storage, database, sessions, and rate limiting are infrastructure concerns owned by the CMS/runtime layer. 【F:strapi/README.md†L43-L87】

## SSR, Browser APIs, and Performance

- No `window`, `document`, storage, canvas, or browser library access at module-load time.
- Browser-only dependencies must be dynamically imported or protected by a platform check.
- Avoid hydration differences caused by time, randomness, viewport measurements, or locale-dependent rendering that is not synchronized with the server.
- Heavy map and visualization code should be isolated, lazy-loaded, and measured against the non-functional budgets documented in `AGENTS.md`.

## Accessibility and Internationalization

- User-facing text uses translation keys; no new hard-coded production copy.
- Interactive components support keyboard operation, visible focus, semantic names, and appropriate ARIA behavior.
- Organisms, templates, and pages define loading, empty, error, disabled, and permission-denied states.
- Focus management is required for modals, drawers, routed detail experiences, and dynamically revealed content.

## Local Development and CI Flows

- **Full-stack loop**: `yarn dev:cms` starts Strapi, `yarn dev:web` starts Angular with HMR, and `yarn dev:all` orchestrates both. 【F:package.json†L9-L24】
- **Front prebuild**: `yarn prebuild:web` runs contract generation and tests before Angular compilation. Preproduction validation also checks selectors and runtime configuration. 【F:package.json†L19-L32】
- **Quality**: `yarn lint` applies the monorepo ESLint configuration and `yarn format:check` validates formatting. 【F:package.json†L33-L41】
- The exact required command sequence and exceptions are maintained in `AGENTS.md`.

## Directory Structure Overview

```text
/ (monorepo root)
├─ openg7-org/               # Angular SSR front-end (@openg7/web)
├─ strapi/                   # Strapi v5 CMS (@openg7/strapi)
├─ packages/
│  ├─ contracts/             # Shared API schemas and code generation
│  └─ tooling/               # Architectural and quality checks
├─ infra/                    # Deployment, CI/CD, and runtime assets
└─ docs/                     # Onboarding and specialized guides
```

For guided discovery, the Mermaid diagram in the onboarding guide presents the main workspaces and their reference team. 【F:docs/getting-started.md†L59-L80】

## Architecture Evolution

A change requires an Architecture Decision Record or an explicit architecture update when it:

- introduces a new workspace or shared package;
- changes dependency direction between layers or domains;
- introduces a new global state mechanism;
- replaces a foundational framework or map/rendering engine;
- changes authentication, authorization, data sovereignty, or persistence boundaries;
- creates a new stable integration surface used by several applications.

Update `ARCHITECTURE.md` for durable principles and `AGENTS.md` for executable implementation rules in the same pull request.

---

<a id="francais"></a>

# Architecture du monorepo OpenG7

Ce document définit les principes architecturaux durables du dépôt `openg7-nexus`. Il décrit les frontières entre workspaces, les règles de dépendance, la composition du front, l'intégration au CMS et les conventions qui permettent à OpenG7 de grandir sans perdre en cohérence.

`ARCHITECTURE.md` explique **pourquoi et où**. [`AGENTS.md`](./AGENTS.md) définit **comment les agents et les contributeurs doivent exécuter le travail**.

## Principes architecturaux

1. **Organisation orientée domaines** : les capacités métier sont regroupées par domaine plutôt que par type de fichier technique.
2. **Frontières explicites** : le front, le CMS, les contrats, le tooling et l'infrastructure ont des responsabilités distinctes.
3. **Atomic Design comme taxonomie de composition** : atomes, molécules, organismes, templates et pages décrivent la responsabilité et la complexité UI sans imposer une arborescence globale.
4. **Signals par défaut** : l'état local et l'état de feature utilisent les signals Angular, sauf lorsqu'un véritable état global justifie NgRx.
5. **Autorité serveur** : l'autorisation et la visibilité UI ne remplacent jamais les permissions du CMS ou de l'API.
6. **Interfaces stables** : contrats API, sélecteurs Angular et hooks `[data-og7*]` sont des surfaces d'intégration versionnées.
7. **Implémentation compatible SSR** : les API propres au navigateur sont isolées et chargées seulement dans un contexte navigateur.
8. **Accessibilité et i18n dès la conception** : les composants réutilisables incluent le clavier, la sémantique et les clés de traduction dès leur première version.

## Sources de vérité

| Sujet | Source de vérité |
| --- | --- |
| Architecture durable et direction des dépendances | `ARCHITECTURE.md` |
| Processus des agents, règles d'implémentation, registres et validations | `AGENTS.md` |
| Schémas API partagés et clients générés | `packages/contracts` |
| Modèles de contenu CMS et permissions serveur | `strapi` |
| Sélecteurs UI et hooks de test stables | Registres de `AGENTS.md` |
| Infrastructure et déploiement | `infra` et documentation par environnement |

## Workspaces et responsabilités

- **Front (`@openg7/web`)** : application Angular 19 standalone/SSR dans `openg7-org`, avec configuration runtime, signals, i18n `@ngx-translate` et intégrations cartographiques. Les scripts `start`, `build` et `build:preprod` orchestrent le serveur Express SSR et la génération de configuration. 【F:openg7-org/package.json†L1-L41】
- **CMS (`@openg7/strapi`)** : workspace Strapi v5 responsable des contenus, seeds idempotents, administration, persistance Postgres, médias et autorisation serveur. 【F:strapi/README.md†L8-L41】【F:strapi/README.md†L66-L87】
- **Contrats API (`packages/contracts`)** : schémas partagés et clients générés consommés par le front et le CMS. Les flux racine de codegen et de tests doivent précéder les builds de release du front. 【F:package.json†L1-L38】
- **Tooling (`@openg7/tooling`)** : validations transversales, notamment les contrôles des sélecteurs `[data-og7]` et autres garde-fous architecturaux. 【F:packages/tooling/package.json†L1-L15】
- **Infrastructure (`infra`)** : manifests de déploiement, configuration runtime, CI/CD et préoccupations propres aux environnements.

## Architecture du front

### Structure orientée domaines

L'application Angular est organisée autour des domaines métier. Chaque domaine possède ses pages routées, son orchestration de features, son UI métier et son accès aux données.

```text
openg7-org/src/app/
├─ core/                      # Infrastructure transverse d'exécution
│  ├─ auth/
│  ├─ config/
│  ├─ http/
│  ├─ observability/
│  ├─ security/
│  └─ ui/                    # UI d'infrastructure globale seulement
├─ shared/                    # Capacités réutilisables et neutres métier
│  ├─ ui/                    # Convention cible
│  │  ├─ primitives/
│  │  ├─ composites/
│  │  └─ patterns/
│  ├─ components/            # Composants partagés existants
│  ├─ directives/
│  ├─ pipes/
│  └─ utilities/
└─ domains/
   └─ <domain>/
      ├─ pages/               # Points d'entrée routés
      ├─ feature/             # Orchestration de cas d'usage et état de feature
      ├─ ui/                  # Composants de présentation propres au domaine
      ├─ data-access/         # Clients API, repositories et adaptateurs du domaine
      └─ models/              # Types métier non couverts par les contrats partagés
```

Les dossiers `shared/ui` représentent une **convention cible**, pas l'obligation d'effectuer une migration massive. Les chemins existants sous `shared/components` demeurent valides jusqu'à ce qu'un composant soit modifié de façon importante ou qu'une migration dédiée soit approuvée.

### Atomic Design adapté à OpenG7

Atomic Design classe la responsabilité d'un composant. Cette classification est indépendante de sa portée métier.

| Niveau UI | Définition OpenG7 | Logique métier | Exemples | Emplacement typique |
| --- | --- | --- | --- | --- |
| **Atome** | Primitive visuelle ou de contrôle indivisible | Aucune | bouton, badge, icône, label, enveloppe d'input | `shared/ui/primitives` |
| **Molécule** | Petit assemblage d'atomes avec une interaction ciblée | Aucune ou état de présentation minimal | champ de recherche, contrôle de dates, groupe label + input | `shared/ui/composites` ou `ui` du domaine |
| **Organisme** | Section UI complète composée de molécules | Orchestration de présentation possible, sans couplage direct à l'infrastructure lorsque possible | en-tête, carte de feed, panneau de contrôle de carte | `shared/ui/patterns`, `shared/components` ou `ui` du domaine |
| **Template** | Squelette de page définissant les régions et le responsive | Aucun chargement de données ni décision métier | shell admin, disposition de page détail | `feature` du domaine ou futur dossier `layouts` |
| **Page** | Composition routée et point d'entrée d'un cas d'usage | Oui : route, chargement, permissions et orchestration | page détail du feed, profil | `domains/<domain>/pages` |

Atomic Design ne crée pas un arbre global `atoms/molecules/organisms` pour tous les domaines. Le placement repose sur deux axes :

1. **Niveau de composition** : atome, molécule, organisme, template ou page.
2. **Portée** : infrastructure globale, UI partagée neutre métier, capacité multidomaine ou UI propre à un domaine.

### Règles de placement

- Placer un composant dans `shared` seulement lorsque son API et sa signification sont neutres métier ou qu'une réutilisation réelle dans plusieurs contextes est identifiée.
- Conserver le vocabulaire et les comportements métier dans `domains/<domain>`.
- Ne pas promouvoir un composant vers `shared` sur la seule hypothèse d'une réutilisation future.
- Ne pas effectuer d'appel API direct dans un atome ou une molécule.
- Les pages orchestrent la route, les permissions, l'état et le chargement; les grandes sections visuelles sont extraites.
- `core` ne dépend d'aucun domaine métier.
- Un domaine n'importe pas l'UI privée d'un autre domaine. Une capacité transverse doit être promue par un contrat ou un package partagé explicite.

### Direction des dépendances

```text
pages
  ↓
orchestration de feature / templates
  ↓
organismes et UI du domaine
  ↓
patterns et composites partagés
  ↓
primitives et design tokens
```

Les dépendances ne remontent pas. Le code partagé ne peut pas importer un domaine. Les primitives UI ne dépendent pas de l'état de feature, de clients HTTP ou de contrats CMS, sauf lorsqu'un type neutre partagé fait explicitement partie de leur API.

### Responsabilités des composants

- Les **composants de présentation** reçoivent des inputs typés et émettent des outputs sémantiques.
- Les **composants de feature** traduisent l'état applicatif en état UI et orchestrent les cas d'usage.
- Le **data-access** communique avec les API et adapte les modèles de transport aux modèles métier.
- Les **pages** relient routage, permissions, contexte analytique et orchestration.
- Les **services** représentent une capacité d'infrastructure ou de domaine; ils ne servent pas de stockage arbitraire pour l'état des composants.

## Interfaces UI stables

Les sélecteurs Angular et attributs `[data-og7*]` sont des interfaces stables utilisées par les templates, les tests, l'analytique et l'automatisation.

- Les sélecteurs de composants Angular utilisent le préfixe `og7-` et le kebab-case.
- Les hooks de test et d'automatisation utilisent `data-og7`, `data-og7-id` ou `data-og7-layer`.
- Les classes Tailwind sont des détails d'implémentation et ne sont pas des sélecteurs de test stables.
- Tout nouveau widget ou action stable est ajouté au registre de `AGENTS.md`.
- Renommer un sélecteur stable exige la mise à jour simultanée des templates, du tooling, des tests et du registre.

## Gestion de l'état

- Préférer `signal`, `computed` et `effect` pour l'état local et l'état de feature.
- Utiliser un store de feature dédié lorsque plusieurs composants coordonnent un cas d'usage non trivial.
- Réserver NgRx et l'état global aux besoins réellement transverses : authentification, utilisateur courant, catalogues partagés ou état global de carte.
- Ne pas dupliquer des données serveur dans plusieurs stores sans stratégie explicite de cache et d'invalidation.

## Contrat Front ↔ CMS

Le front Angular consomme les endpoints Strapi à travers des contrats générés ou partagés. Le CMS demeure autoritaire pour la persistance, la validation, le contrôle d'accès et le cycle de vie des contenus.

- Toute modification de contrat met à jour `packages/contracts`, les consommateurs, les tests et la documentation dans le même changement.
- Les guards Angular améliorent la navigation, mais ne sécurisent pas le serveur.
- Les permissions et policies Strapi sont obligatoires pour chaque opération protégée.
- Les seeds sont idempotents et conscients de l'environnement.
- Le stockage des médias, la base de données, les sessions et le rate limiting appartiennent au CMS et à l'infrastructure. 【F:strapi/README.md†L43-L87】

## SSR, API navigateur et performance

- Aucun accès à `window`, `document`, au stockage, au canvas ou à une bibliothèque navigateur au chargement du module.
- Les dépendances navigateur sont importées dynamiquement ou protégées par une vérification de plateforme.
- Éviter les divergences d'hydratation causées par le temps, l'aléatoire, la mesure du viewport ou un rendu local non synchronisé avec le serveur.
- Le code lourd de carte ou de visualisation est isolé, lazy-loadé et mesuré selon les budgets non fonctionnels de `AGENTS.md`.

## Accessibilité et internationalisation

- Le texte visible utilise des clés de traduction; aucun nouveau texte de production n'est codé en dur.
- Les composants interactifs prennent en charge le clavier, le focus visible, les noms accessibles et les rôles ARIA appropriés.
- Les organismes, templates et pages définissent les états de chargement, vide, erreur, désactivé et accès refusé.
- La gestion du focus est obligatoire pour les modales, drawers, pages détail et contenus révélés dynamiquement.

## Flux de développement local et CI

- **Boucle full-stack** : `yarn dev:cms` démarre Strapi, `yarn dev:web` démarre Angular avec HMR et `yarn dev:all` orchestre les deux. 【F:package.json†L9-L24】
- **Prébuild front** : `yarn prebuild:web` exécute la génération des contrats et les tests avant la compilation Angular. La validation préproduction vérifie aussi les sélecteurs et la configuration runtime. 【F:package.json†L19-L32】
- **Qualité** : `yarn lint` applique ESLint au monorepo et `yarn format:check` valide le formatage. 【F:package.json†L33-L41】
- La séquence exacte des commandes obligatoires et les exceptions sont maintenues dans `AGENTS.md`.

## Vue d'ensemble du dépôt

```text
/ (racine du monorepo)
├─ openg7-org/               # Front Angular SSR (@openg7/web)
├─ strapi/                   # CMS Strapi v5 (@openg7/strapi)
├─ packages/
│  ├─ contracts/             # Schémas API partagés et codegen
│  └─ tooling/               # Contrôles architecturaux et qualité
├─ infra/                    # Déploiement, CI/CD et runtime
└─ docs/                     # Onboarding et guides spécialisés
```

Le diagramme Mermaid du guide d'onboarding présente les principaux workspaces et leur équipe référente. 【F:docs/getting-started.md†L59-L80】

## Évolution de l'architecture

Une décision d'architecture ou une mise à jour explicite de ce document est requise lorsqu'un changement :

- introduit un nouveau workspace ou package partagé;
- modifie la direction des dépendances entre couches ou domaines;
- introduit un nouveau mécanisme d'état global;
- remplace un framework fondamental ou un moteur de carte/rendu;
- change les frontières d'authentification, d'autorisation, de souveraineté des données ou de persistance;
- crée une nouvelle surface d'intégration stable utilisée par plusieurs applications.

Mettre à jour `ARCHITECTURE.md` pour les principes durables et `AGENTS.md` pour les règles exécutables dans la même pull request.

---

_Last updated / Dernière mise à jour: 2026-07-18_
