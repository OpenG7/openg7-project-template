#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warnings = [];

function rel(path) {
  return relative(repoRoot, path).split('\\').join('/');
}

function requireFile(path, message) {
  if (!existsSync(path)) {
    errors.push(`${message}: ${rel(path)} est introuvable.`);
    return false;
  }
  return true;
}

function walkMarkdownFiles(dir) {
  const files = [];
  if (!existsSync(dir)) return files;
  const walk = (current) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const entryPath = join(current, entry.name);
      if (entry.isDirectory()) walk(entryPath);
      else if (entry.name.endsWith('.md')) files.push(entryPath);
    }
  };
  walk(dir);
  return files;
}

function checkRequiredFiles() {
  requireFile(join(repoRoot, 'README.md'), 'Fichier racine manquant');
  requireFile(join(repoRoot, 'AGENTS.md'), 'Fichier racine manquant');
  requireFile(join(repoRoot, 'docs', 'ARCHITECTURE.md'), 'Fichier de gouvernance manquant');
}

function checkAgentsRequiredSections() {
  const agentsPath = join(repoRoot, 'AGENTS.md');
  if (!existsSync(agentsPath)) return;
  const content = readFileSync(agentsPath, 'utf8');
  const requiredHeadings = [
    'Règles non négociables pour les agents',
    'Definition of Done',
    'Maintenance de ce document',
  ];
  for (const heading of requiredHeadings) {
    if (!content.includes(heading)) {
      errors.push(`AGENTS.md : section obligatoire absente ("${heading}").`);
    }
  }
}

function extractFrontmatter(content) {
  if (!content.startsWith('---')) return null;
  const end = content.indexOf('\n---', 3);
  if (end === -1) return null;
  return content.slice(3, end).trim();
}

function checkInstructionFiles() {
  const dir = join(repoRoot, '.github', 'instructions');
  if (!existsSync(dir)) {
    warnings.push('.github/instructions/ est absent : aucune instruction Copilot scopée.');
    return;
  }

  for (const entry of readdirSync(dir)) {
    if (!entry.endsWith('.instructions.md')) continue;
    const filePath = join(dir, entry);
    const frontmatter = extractFrontmatter(readFileSync(filePath, 'utf8'));

    if (!frontmatter || !/applyTo:/.test(frontmatter)) {
      errors.push(`${rel(filePath)} : frontmatter "applyTo" manquant ou mal formé.`);
    }
  }
}

function checkSkillFiles() {
  const dir = join(repoRoot, '.agents', 'skills');
  if (!existsSync(dir)) {
    warnings.push('.agents/skills/ est absent : aucune procédure enregistrée.');
    return;
  }

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const skillPath = join(dir, entry.name, 'SKILL.md');
    if (!existsSync(skillPath)) {
      errors.push(`.agents/skills/${entry.name}/ : SKILL.md manquant.`);
      continue;
    }
    const frontmatter = extractFrontmatter(readFileSync(skillPath, 'utf8'));
    if (!frontmatter || !/name:/.test(frontmatter) || !/description:/.test(frontmatter)) {
      errors.push(`${rel(skillPath)} : frontmatter "name"/"description" manquant ou mal formé.`);
    }
  }
}

function checkLineReferenceDrift() {
  const agentsPath = join(repoRoot, 'AGENTS.md');
  const agentsLineCount = existsSync(agentsPath)
    ? readFileSync(agentsPath, 'utf8').split('\n').length
    : 0;
  if (agentsLineCount === 0) return;

  const candidateFiles = [
    ...walkMarkdownFiles(join(repoRoot, '.github', 'instructions')),
    ...walkMarkdownFiles(join(repoRoot, '.agents', 'skills')),
  ];

  for (const filePath of candidateFiles) {
    const content = readFileSync(filePath, 'utf8');
    const lineRefs = [...content.matchAll(/ligne\s+(\d+)/gi)].map((m) => Number(m[1]));
    for (const lineNo of lineRefs) {
      if (lineNo > agentsLineCount) {
        errors.push(
          `${rel(filePath)} : référence "ligne ${lineNo}" dépasse la longueur actuelle d'AGENTS.md (${agentsLineCount} lignes). AGENTS.md a probablement été réorganisé sans mettre à jour ce pointeur.`,
        );
      }
    }
  }
}

function checkLocalMarkdownLinks() {
  const filesToScan = [
    join(repoRoot, 'README.md'),
    join(repoRoot, 'AGENTS.md'),
    join(repoRoot, 'docs', 'ARCHITECTURE.md'),
    ...walkMarkdownFiles(join(repoRoot, '.github')),
    ...walkMarkdownFiles(join(repoRoot, '.agents')),
  ];

  const linkPattern = /\]\(([^)]+)\)/g;

  for (const filePath of filesToScan) {
    if (!existsSync(filePath)) continue;
    const content = readFileSync(filePath, 'utf8');
    for (const match of content.matchAll(linkPattern)) {
      const target = match[1].split('#')[0].trim();
      if (!target || /^([a-z]+:)?\/\//i.test(target) || target.startsWith('mailto:')) continue;
      const resolved = resolve(dirname(filePath), target);
      if (!existsSync(resolved)) {
        errors.push(`${rel(filePath)} : lien local mort vers "${target}".`);
      }
    }
  }
}

checkRequiredFiles();
checkAgentsRequiredSections();
checkInstructionFiles();
checkSkillFiles();
checkLineReferenceDrift();
checkLocalMarkdownLinks();

for (const warning of warnings) {
  console.warn(`⚠ ${warning}`);
}

if (errors.length > 0) {
  console.error(`\n${errors.length} problème(s) détecté(s) :\n`);
  for (const error of errors) {
    console.error(`✗ ${error}`);
  }
  process.exit(1);
}

console.log('✓ Standards du template respectés (fichiers requis, sections AGENTS.md, instructions Copilot, skills, liens locaux).');
