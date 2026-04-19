# basic-memory-skills

Skills for [Basic Memory](https://github.com/basicmachines-co/basic-memory) — teach AI coding agents how to use Basic Memory's MCP tools effectively. Improved with [12-factor-agents](https://github.com/humanlayer/12-factor-agents) principles for better context management, state handling, and session resilience.

---

## What This Gives You

Without Basic Memory, your Copilot CLI agent starts fresh every session. With it, your agent remembers:
- Decisions made and why
- Active tasks and their state
- People, organizations, and concepts you've discussed
- Project context across weeks or months of work

These skills teach your agent *how to use* Basic Memory effectively — not just the API calls, but the patterns that make a knowledge graph actually useful.

---

## Prerequisites

### 1. Install Basic Memory

```bash
pip install basic-memory
```

Or see the [full install guide](https://github.com/basicmachines-co/basic-memory#installation).

> **Note:** The `.mcp.json` config uses [`uvx`](https://docs.astral.sh/uv/) to launch the MCP server. If you installed Basic Memory via `pip`, you can either [install `uv`](https://docs.astral.sh/uv/getting-started/installation/) or update `.mcp.json` to use `basic-memory mcp` directly.

### 2. Configure the MCP Server

Copy `.mcp.json` from this repo into your project root (or `~/.copilot/`):

```bash
cp .mcp.json /path/to/your/project/
```

Then connect in Copilot CLI:

```
/mcp
```

Verify the Basic Memory tools are available — you should see `write_note`, `read_note`, `search_notes`, etc.

### 3. Install These Skills

**Option A — npm (recommended):**

```bash
npm install -g basic-memory-skills
```

Skills are automatically copied to `~/.copilot/skills/` (and `~/.claude/skills/` if present). Then in Copilot CLI:

```
/skills reload
```

**Option B — npx (other agents):**

```bash
# Install all skills
npx skills add basicmachines-co/basic-memory-skills

# Install a specific skill
npx skills add basicmachines-co/basic-memory-skills --skill memory-tasks

# Check for updates
npx skills check

# Update installed skills
npx skills update
```

**Option C — manual:**

Clone this repo and copy any skill folder into `~/.copilot/skills/`:

```bash
git clone https://github.com/basicmachines-co/basic-memory-skills
cp -r basic-memory-skills/memory-* ~/.copilot/skills/
```

Then in Copilot CLI:

```
/skills reload
```

---

## Skills

| Skill | Use When | Key 12-Factor Improvement |
|-------|----------|--------------------------|
| **memory-notes** | Creating or updating notes in your knowledge graph | F3: Context hygiene + pre-fetch pattern |
| **memory-tasks** | Tracking multi-step work across sessions | F12: Stateless reducer framing; F5: single source of truth; F6: explicit pause/resume protocols |
| **memory-reflect** | Consolidating recent activity into long-term memory | F9: Reflection = context compaction, not journaling |
| **memory-ingest** | Turning meeting notes, transcripts, or documents into structured entities | F3: Structure entities for retrieval, not storage |
| **memory-research** | Researching companies, people, technologies | F3: Capture why you searched, not just what you found |
| **memory-schema** | Defining and managing structured note types | F4: Schemas = typed agent outputs; F5: clarified dual-location rationale |
| **memory-defrag** | Cleaning up bloated or fragmented memory files | F9: Resolved error traces as explicit defrag target |
| **memory-lifecycle** | Archiving completed work, managing entity status | F5: Folder = canonical status; F6: archive=pause, reactivate=resume |
| **memory-metadata-search** | Finding notes by structured frontmatter fields | F3: Precision context retrieval pattern |
| **memory-literary-analysis** | Analyzing a book or literary work end-to-end | F12: Stateless reducer at scale; F3: seed entities = pre-fetch pattern |

---

## 12-Factor-Agents Principles Applied

These skills are improved versions of the originals. Each improvement applies a specific principle from [12-factor-agents](https://github.com/humanlayer/12-factor-agents):

### Factor 3 — Own Your Context Window
Notes retrieved from Basic Memory enter your context window and cost tokens. These skills add explicit guidance on:
- **Context hygiene**: what NOT to put in notes (resolved errors, stale status, raw logs)
- **Pre-fetch pattern**: load relevant context at session start, not piecemeal mid-task
- **Structure for retrieval**: write notes so future agents get exactly what they need

Applied to: `memory-notes`, `memory-ingest`, `memory-research`, `memory-metadata-search`, `memory-literary-analysis`

### Factor 5 — Unified Execution State
Your knowledge graph is the state. These skills clarify:
- The task note IS the execution state — not a record of it
- Why fields appear in both frontmatter and observations (different consumers, not duplication)
- Folder location as canonical status (not frontmatter)

Applied to: `memory-tasks`, `memory-schema`, `memory-lifecycle`

### Factor 6 — Launch/Pause/Resume
Context compaction ends sessions unexpectedly. These skills formalize:
- **Pause protocol**: what to flush before `/compact` or session end
- **Resume protocol**: search → read → validate step → continue
- Archive/reactivate as entity-level pause/resume

Applied to: `memory-tasks`, `memory-lifecycle`

### Factor 9 — Compact Errors Into Context
Stale information degrades your knowledge graph over time. These skills add:
- Reflection as context compaction, not journaling (strip resolved errors, superseded decisions)
- "Resolved error traces" as an explicit defrag target
- The fresh-agent test: "Would this note help or mislead a fresh agent?"

Applied to: `memory-reflect`, `memory-defrag`

### Factor 12 — Stateless Reducer
Each Copilot CLI session is stateless. The knowledge graph is the accumulated state. These skills frame Basic Memory as a stateless reducer:

```
Each session: read state → process → write state → exit
```

Applied to: `memory-tasks`, `memory-literary-analysis`, and as framing in `memory-notes`

---

## Basic Memory Cloud

Everything works locally — cloud adds cross-device, team, and production capabilities:

- **Your agent's memory travels with you** — same knowledge graph on laptop, desktop, and hosted environments
- **Team knowledge sharing** — org workspaces let multiple agents and team members build on a shared knowledge base
- **Durable memory for production agents** — persistent memory that survives CI teardowns and container restarts
- **Multi-agent coordination** — multiple agents can read and write to the same graph

Cloud extends local-first — still plain markdown, still yours. Start with a [7-day free trial](https://basicmemory.com) and use code `BMFOSS` for 20% off for 3 months.

---

## Compatible Agents

These skills work with any AI coding agent that supports the SKILL.md format:

- **GitHub Copilot CLI** — primary target; uses `~/.copilot/skills/`
- **Claude Code** — loads skills from `~/.claude/skills/` or `.claude/skills/`
- **Claude Desktop** — upload skill ZIPs via Settings > Capabilities
- **Cursor** — AI-powered coding with skill support
- **Windsurf** — agent-based development with skill loading
- **Any agent** supporting markdown-based skill files

---

## Workflow Examples

### Start of any session

```
/skills memory-tasks
→ "Search for active tasks and resume"
```

The agent will search for active tasks, read the current one, validate the step, and continue.

### After a meeting

```
/skills memory-ingest
→ [paste transcript]
```

The agent parses the content, searches for existing entities, proposes new ones for your approval, and creates structured notes.

### Weekly maintenance

```
/skills memory-reflect
/skills memory-defrag
```

Consolidate insights into MEMORY.md, then clean up fragmented or stale content.

---

## Development

See [DEVELOPMENT.md](DEVELOPMENT.md) for contributor setup, testing, adding new skills, commit conventions, and changesets.

---

## Attribution

Skill content improvements apply principles from [12-factor-agents](https://github.com/humanlayer/12-factor-agents) (Dex Horthy / [HumanLayer](https://github.com/humanlayer)). Commit conventions follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/). Version tracking uses [Changesets](https://github.com/changesets/changesets).

12-factor improvements developed with [GitHub Copilot CLI](https://docs.github.com/en/copilot/github-copilot-in-the-cli).

---

## License

MIT — see [LICENSE](LICENSE).
