---
name: architecture-review
description: Vérifier qu'un changement respecte les frontières de domaines, la direction des dépendances et les registres définis par AGENTS.md et ARCHITECTURE.md.
---

# Réviser un changement pour conformité architecturale OpenG7

Règles complètes faisant foi : [`AGENTS.md`](../../../AGENTS.md), section « Règles non négociables pour les agents » (ligne 11) et [`docs/ARCHITECTURE.md`](../../../docs/ARCHITECTURE.md), sections « Placement rules » et « Dependency direction ».

## Checklist de revue

1. **Frontières** : le changement respecte-t-il `core` / `shared` / `domains` / `packages` ? `core` ne dépend d'aucun domaine ; le code partagé n'importe jamais un domaine ; une primitive ne dépend jamais d'une page, d'une feature ou d'un client API (`AGENTS.md`, ligne 51).
2. **Pas d'import privé inter-domaines** : une capacité transverse est-elle promue via une API partagée plutôt qu'importée directement d'un autre domaine (`AGENTS.md`, ligne 46) ?
3. **Sélecteurs stables** : aucune classe Tailwind n'est utilisée comme sélecteur de test ; tout nouveau sélecteur `og7-*` ou hook `[data-og7*]` est ajouté au registre dans le même changement (`AGENTS.md`, lignes 17-18).
4. **Sécurité serveur** : aucun guard ou masquage UI Angular n'est traité comme une mesure de sécurité — Strapi reste autoritaire (`AGENTS.md`, ligne 19).
5. **Justification du placement** : si un composant est déplacé vers `shared`, une réutilisation réelle est démontrée — pas une réutilisation hypothétique (`AGENTS.md`, ligne 44).
6. **Portée d'un changement d'architecture** : si le changement introduit un nouveau workspace, un nouveau mécanisme d'état global, ou change la direction des dépendances, `ARCHITECTURE.md` doit être mis à jour dans la même PR (`ARCHITECTURE.md`, section « Architecture Evolution »).
7. **Synchronisation documentaire** : si `AGENTS.md` et `ARCHITECTURE.md` divergent à cause du changement, les deux sont corrigés ensemble, jamais un seul (`AGENTS.md`, ligne 7 et ligne 1955).

## Verdict

Documenter explicitement, pour chaque point ci-dessus, s'il est respecté, non applicable, ou en écart justifié — plutôt que d'affirmer une conformité globale non détaillée.
