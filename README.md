# copilot-memory-skills

Skills for [GitHub Copilot CLI](https://docs.github.com/en/copilot/github-copilot-in-the-cli) that connect your agent to [Basic Memory](https://github.com/basicmachines-co/basic-memory) — a local knowledge graph that persists across sessions.

Derived from [`basicmachines-co/basic-memory-skills`](https://github.com/basicmachines-co/basic-memory-skills) (MIT License). Improved with [12-factor-agents](https://github.com/humanlayer/12-factor-agents) principles for better context management, state handling, and session resilience.

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

From this repo root:

```
/skills memory-notes
/skills memory-tasks
/skills memory-reflect
/skills memory-ingest
/skills memory-research
/skills memory-schema
/skills memory-defrag
/skills memory-lifecycle
/skills memory-metadata-search
/skills memory-literary-analysis
```

Or to load all at once, point Copilot CLI to the repo directory.

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

## Attribution

This repo is derived from [`basicmachines-co/basic-memory-skills`](https://github.com/basicmachines-co/basic-memory-skills), which is the original source of all 10 skill workflows. Licensed under MIT.

Improvements applied in this fork:
- Copilot CLI compatibility framing
- 12-factor-agents principle integration (per-skill, not just as documentation)
- Enhanced protocols for context hygiene, pause/resume, error compaction

---

## License

MIT — see original source for full license text.
