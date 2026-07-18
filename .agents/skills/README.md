# Registre de procédures — `.agents/skills/`

Ce dossier contient des **procédures documentées, neutres vis-à-vis de l'outil**, pour les tâches récurrentes des projets OpenG7 (créer un composant Angular conforme, réviser une PR pour conformité architecturale, etc.). Chaque procédure est un pointeur vers les sections pertinentes d'[`AGENTS.md`](../../AGENTS.md), pas une copie de son contenu.

## Ce que ce dossier n'est pas

`.agents/skills/` **n'est découvert automatiquement par aucun outil connu**. Ce n'est pas l'équivalent d'un mécanisme natif :

- Claude Code découvre des skills invocables dans `.claude/skills/<nom>/SKILL.md`, avec son propre format de frontmatter.
- GitHub Copilot lit `.github/copilot-instructions.md` et `.github/instructions/*.instructions.md` (voir ce dossier).
- Codex et les autres agents lisent `AGENTS.md` directement.

Avant de supposer qu'un outil charge automatiquement une procédure d'ici, vérifier sa documentation et, si nécessaire, dupliquer ou adapter la procédure vers l'emplacement natif de cet outil (ex. copier vers `.claude/skills/` avec le frontmatter attendu par Claude Code). Ne pas modifier le format de ces fichiers pour « deviner » un format d'outil non vérifié.

## Format

```markdown
---
name: kebab-case-name
description: Une phrase — quand utiliser cette procédure.
---

# Titre

Étapes numérotées, avec pointeurs `AGENTS.md` (ligne N) plutôt que duplication du contenu.
```

## Procédures disponibles

- [`create-angular-component/SKILL.md`](./create-angular-component/SKILL.md) — créer un composant Angular conforme aux conventions OpenG7.
- [`architecture-review/SKILL.md`](./architecture-review/SKILL.md) — vérifier qu'un changement respecte les frontières et règles d'`AGENTS.md`/`ARCHITECTURE.md`.
