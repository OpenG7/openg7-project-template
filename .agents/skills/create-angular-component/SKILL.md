---
name: create-angular-component
description: Créer un nouveau composant Angular conforme aux conventions OpenG7 (Atomic Design, portée métier, registres de sélecteurs).
---

# Créer un composant Angular OpenG7

Procédure complète et faisant foi : [`AGENTS.md`](../../../AGENTS.md), section « Procédure avant création d'un composant » (ligne 67) et la table de placement en section « Composition UI — Atomic Design adapté à OpenG7 » (ligne 22).

## Étapes

1. Rechercher une implémentation équivalente par nom, responsabilité, sélecteur et apparence — dans les registres (`AGENTS.md`, lignes 117 et 214) et dans le code. Ne pas créer si un composant, contrat ou hook stable existe déjà.
2. Écrire en une phrase la responsabilité unique du composant.
3. Déterminer le niveau Atomic Design (atome / molécule / organisme / template / page).
4. Déterminer la portée métier (infrastructure globale, partagé neutre, multidomaine, ou propre à un domaine).
5. Choisir l'emplacement avec la matrice niveau × portée (`AGENTS.md`, ligne 33).
6. Définir une API typée : inputs, outputs, états UI.
7. Prévoir les états `loading`, `empty`, `error`, `disabled`, `access-denied` lorsque pertinents.
8. Ajouter i18n, accessibilité clavier et gestion du focus dès la première version — jamais en suivi.
9. Ajouter le sélecteur `og7-*` (kebab-case) et les hooks `[data-og7*]` nécessaires ; les inscrire dans les registres d'`AGENTS.md`.
10. Ajouter les tests correspondant au niveau du composant (`AGENTS.md`, table « Niveau de test attendu », ligne 80).

## Avant de considérer la tâche terminée

Vérifier chaque case de la Definition of Done (`AGENTS.md`, ligne 104) : dépendances autorisées, SSR-safe, sélecteurs enregistrés, validations locales exécutées.
