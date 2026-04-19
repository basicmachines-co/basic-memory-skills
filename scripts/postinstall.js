#!/usr/bin/env node
// Installs memory skills to all detected agent skill directories.
// Supports: ~/.copilot/skills, ~/.claude/skills, ~/.agents/skills

// Skip in CI or when explicitly opted out
if (process.env.CI || process.env.SKIP_POSTINSTALL) {
  process.exit(0);
}

const fs = require('fs');
const path = require('path');
const os = require('os');

const SKILL_DIRS = [
  path.join(os.homedir(), '.copilot', 'skills'),
  path.join(os.homedir(), '.claude', 'skills'),
  path.join(os.homedir(), '.agents', 'skills'),
];

const SKILLS = [
  'memory-defrag',
  'memory-ingest',
  'memory-lifecycle',
  'memory-literary-analysis',
  'memory-metadata-search',
  'memory-notes',
  'memory-reflect',
  'memory-research',
  'memory-schema',
  'memory-tasks',
];

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Find which skills dirs exist (at least one parent must exist)
const targets = SKILL_DIRS.filter(d => {
  const parent = path.dirname(d);
  return fs.existsSync(parent);
});

if (targets.length === 0) {
  console.log('⚠️  No supported agent home directory found (~/.copilot, ~/.claude, ~/.agents).');
  console.log('   Install manually: copy skill folders to ~/.copilot/skills/');
  process.exit(0);
}

const pkgRoot = path.join(__dirname, '..');
let installed = 0;

try {
  for (const skillsDir of targets) {
    fs.mkdirSync(skillsDir, { recursive: true });
    let count = 0;
    for (const skill of SKILLS) {
      const src = path.join(pkgRoot, skill);
      const dest = path.join(skillsDir, skill);
      if (fs.existsSync(src)) {
        // Remove existing dest to clean stale files from prior versions
        if (fs.existsSync(dest)) {
          fs.rmSync(dest, { recursive: true, force: true });
        }
        copyDirSync(src, dest);
        count++;
        installed++;
      }
    }
    console.log(`✅ Installed ${count}/${SKILLS.length} memory skills → ${skillsDir}`);
  }
} catch (err) {
  console.error(`⚠️  Failed to install skills: ${err.message}`);
  console.error('   You can manually copy skill folders to ~/.copilot/skills/');
  process.exitCode = 1;
}

if (installed > 0) {
  console.log('\nTo activate in GitHub Copilot CLI, run: /skills reload');
  console.log('To activate in Claude Code, restart your session.');
}
