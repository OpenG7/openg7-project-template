#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function parseArgs(argv) {
  const args = { target: null, check: false, dryRun: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--target') {
      args.target = argv[i + 1];
      i += 1;
    } else if (arg === '--check') {
      args.check = true;
    } else if (arg === '--dry-run') {
      args.dryRun = true;
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    }
  }
  return args;
}

function printUsage() {
  console.log(`Usage: node scripts/sync-openg7-standards.mjs --target <chemin-du-depot-cible> [--check] [--dry-run]

Copie les fichiers de gouvernance OpenG7 (AGENTS.md, ARCHITECTURE.md, instructions
Copilot, templates GitHub, workflows de dispatch agent, skills) depuis ce template
vers un dépôt cible, tel que listé dans scripts/sync-manifest.json.

  --target <path>  Chemin (relatif ou absolu) vers une copie locale du dépôt cible.
  --check          N'écrit rien ; rapporte les fichiers absents ou en dérive et sort en erreur si des différences existent.
  --dry-run        N'écrit rien ; rapporte ce qui serait copié, sort toujours en succès.
`);
}

const args = parseArgs(process.argv.slice(2));

if (args.help || !args.target) {
  printUsage();
  process.exit(args.help ? 0 : 1);
}

const targetRoot = resolve(process.cwd(), args.target);
if (!existsSync(targetRoot)) {
  console.error(`Le dépôt cible n'existe pas : ${targetRoot}`);
  process.exit(1);
}

const manifestPath = join(repoRoot, 'scripts', 'sync-manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

const created = [];
const updated = [];
const unchanged = [];
const missingSource = [];

for (const relPath of manifest.files) {
  const sourcePath = join(repoRoot, relPath);
  const destPath = join(targetRoot, relPath);

  if (!existsSync(sourcePath)) {
    missingSource.push(relPath);
    continue;
  }

  const sourceContent = readFileSync(sourcePath);
  const destExists = existsSync(destPath);
  const destContent = destExists ? readFileSync(destPath) : null;

  if (destExists && Buffer.compare(sourceContent, destContent) === 0) {
    unchanged.push(relPath);
    continue;
  }

  if (destExists) {
    updated.push(relPath);
  } else {
    created.push(relPath);
  }

  if (!args.check && !args.dryRun) {
    mkdirSync(dirname(destPath), { recursive: true });
    writeFileSync(destPath, sourceContent);
  }
}

if (missingSource.length > 0) {
  console.warn(`⚠ Fichiers listés dans le manifeste mais introuvables dans ce dépôt :`);
  for (const relPath of missingSource) console.warn(`  - ${relPath}`);
}

const drifted = [...created, ...updated];

if (args.check) {
  if (drifted.length === 0) {
    console.log(`✓ ${targetRoot} est aligné avec le contrat de gouvernance OpenG7 (${manifest.files.length} fichiers vérifiés).`);
    process.exit(0);
  }
  console.error(`✗ ${drifted.length} fichier(s) en dérive par rapport au template :`);
  for (const relPath of created) console.error(`  + manquant  : ${relPath}`);
  for (const relPath of updated) console.error(`  ~ différent : ${relPath}`);
  process.exit(1);
}

const verb = args.dryRun ? 'seraient copiés' : 'ont été copiés';
console.log(`${created.length} fichier(s) créé(s), ${updated.length} fichier(s) mis à jour, ${unchanged.length} inchangé(s).`);
if (drifted.length > 0) {
  console.log(`Fichiers qui ${verb} :`);
  for (const relPath of created) console.log(`  + ${relPath}`);
  for (const relPath of updated) console.log(`  ~ ${relPath}`);
}
