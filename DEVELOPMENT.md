# Development

## Repository Structure

```
basic-memory-skills/
├── memory-tasks/SKILL.md                # Task tracking skill
├── memory-schema/SKILL.md               # Schema lifecycle skill
├── memory-reflect/SKILL.md              # Memory consolidation skill
├── memory-notes/SKILL.md                # Note writing patterns skill
├── memory-defrag/SKILL.md               # Memory cleanup skill
├── memory-metadata-search/SKILL.md      # Metadata search skill
├── memory-lifecycle/SKILL.md            # Entity lifecycle skill
├── memory-ingest/SKILL.md               # External input processing skill
├── memory-research/SKILL.md             # Web research skill
├── memory-literary-analysis/SKILL.md    # Literary analysis skill
├── scripts/postinstall.js               # npm postinstall — copies skills to agent dirs
├── .changeset/                          # Changeset config and pending changesets
├── package.json                         # npm package definition
├── commitlint.config.js                 # Conventional Commits enforcement
├── skills-lock.json                     # Skills CLI lock file (auto-generated)
├── CLAUDE.md                            # Claude Code agent guidance
├── AGENTS.md                            # Agent guidance pointer
├── .mcp.json                            # MCP server configuration
├── DEVELOPMENT.md                       # This file
└── README.md
```

Each skill is a single `SKILL.md` file with YAML frontmatter (`name`, `description`) and markdown instructions.

## Testing Skills Locally

### Via npm (recommended)

Install the package globally to auto-deploy skills to all supported agent directories:

```bash
npm install -g basic-memory-skills
```

The postinstall script copies skills to `~/.copilot/skills/`, `~/.claude/skills/`, and `~/.agents/skills/` (whichever exist). Then reload in your agent:

```
# GitHub Copilot CLI
/skills reload

# Claude Code — restart your session
```

### Manual copy

Copy a skill into your agent's skills directory and start a new session:

```bash
# GitHub Copilot CLI — global
cp -r memory-tasks ~/.copilot/skills/

# Claude Code — global
cp -r memory-tasks ~/.claude/skills/

# Claude Code — project-scoped
cp -r memory-tasks .claude/skills/

# Any agent that reads SKILL.md files
cp -r memory-tasks <agent-skills-dir>/
```

Then start a new session and verify the skill is loaded (e.g., ask the agent to create a task).

## Installing via npx

Users can install or update skills with the [Skills CLI](https://github.com/vercel-labs/skills):

```bash
# Install all skills
npx skills add basicmachines-co/basic-memory-skills

# Install a specific skill
npx skills add basicmachines-co/basic-memory-skills --skill memory-tasks

# Install for a specific agent
npx skills add basicmachines-co/basic-memory-skills --agent claude
```

## Adding a New Skill

1. Create a new directory: `memory-<name>/SKILL.md`
2. Add YAML frontmatter with `name` and `description`
3. Write skill instructions in markdown
4. Add the skill directory to the `files` array in `package.json`
5. Add the skill name to the `SKILLS` array in `scripts/postinstall.js`
6. Update `README.md` with the new skill's summary
7. Create a changeset: `npx changeset` (select `minor` for new skills)
8. Commit and push

## Commit Conventions

All commits follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/). A [commitlint](https://github.com/conventional-changelog/commitlint) configuration is included — run `npx commitlint --edit` to validate commit messages locally.

```
<type>[optional scope]: <description>
```

Common types:
- `feat:` — new skill or feature (minor version bump)
- `fix:` — bug fix (patch version bump)
- `docs:` — documentation only
- `chore:` — build, tooling, maintenance

Examples:
```
feat(memory-tasks): add pause/resume protocol
fix(postinstall): handle missing ~/.copilot directory
docs: update DEVELOPMENT.md with commit conventions
```

## Changesets

[Changesets](https://github.com/changesets/changesets) track what changed and at what version level for every PR:

```bash
# After making changes, create a changeset
npx changeset

# On release, bump versions and generate changelog
npx changeset version

# Publish
npx changeset publish
```

## OpenClaw Plugin Integration

These skills are also bundled in the [`@openclaw/basic-memory`](https://github.com/basicmachines-co/openclaw-basic-memory) plugin. When updating skills here, copy the updated files to the plugin repo:

```bash
# From the plugin repo root
cp ../basic-memory-skills/memory-<name>/SKILL.md skills/memory-<name>/
```

Then add the path to the `skills` array in the plugin's `openclaw.plugin.json` and commit both repos.
