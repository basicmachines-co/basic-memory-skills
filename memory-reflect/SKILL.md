---
name: memory-reflect
description: "Sleep-time memory reflection: review recent conversations and daily notes, extract insights, and consolidate into long-term memory. Applies 12-factor-agents Factor 9 (compact errors into context) — reflection is context compaction, not journaling. Use when triggered by cron, heartbeat, or explicit request."
---

# Memory Reflect

Distill recent activity into durable long-term memory by compacting signal from noise.

> **Factor 9 — Compact Errors Into Context:** Reflection is not archiving. It is *compaction*. The goal is not to preserve everything that happened — it is to distill what matters and discard what doesn't. MEMORY.md should shrink (or stay flat) as often as it grows. If it only ever grows, you're journaling, not reflecting.

Inspired by sleep-time compute — the idea that memory formation happens best *between* active sessions, not during them.

## When to Run

- **Cron/heartbeat**: Schedule as a periodic background task (recommended: 1-2x daily)
- **On demand**: User asks to reflect, consolidate, or review recent memory
- **Post-compaction**: After context window compaction events

## Process

### 1. Gather Recent Material

Find what changed recently, then read the relevant files:

```python
# Find recently modified notes — use json format for the complete list
# (text format truncates to ~5 items in the summary)
recent_activity(timeframe="2d", output_format="json")

# Read specific daily notes
read_note(identifier="memory/2026-02-27")
read_note(identifier="memory/2026-02-26")

# Check active tasks
search_notes(note_types=["task"], status="active")
```

### 2. Evaluate What Matters

For each piece of information, decide: **keep, strip, or defer?**

**Keep** — distill this into MEMORY.md:
- A **decision** that affects future work
- A **lesson learned** or mistake to avoid
- A **preference** or working style insight
- A **relationship** detail (who does what, contact info)
- A **pattern** worth repeating or avoiding

**Strip** — do not carry forward:
- Resolved error traces (debugging steps, failed attempts, workaround logs)
- Superseded decisions (the new decision supersedes the old — keep only the current one)
- Transient activity (weather checked, heartbeat ran, routine status polls)
- Content already captured in MEMORY.md — don't duplicate
- "I tried X and it failed" once the issue is resolved — this is noise, not lesson
- Session artifacts that had no lasting impact

**Defer** — flag for later with `(needs confirmation)`:
- Seems important but you're not sure it's accurate
- Requires more data points before it becomes a pattern

The compaction test: *If I removed this from MEMORY.md, would future sessions be worse off?* If no, remove it.

### 3. Update Long-Term Memory

Write consolidated insights to `MEMORY.md` following its existing structure:
- **Add new sections or update existing ones in-place** — merge, don't append
- Use concise, factual language
- Include dates for temporal context
- **Remove or update outdated entries** that the new information supersedes
- **Restructure over time** — if MEMORY.md is a chronological dump, reorganize it into topical sections. Curated knowledge > raw logs.

```python
# Update an existing entry (don't append a duplicate)
edit_note(
  identifier="MEMORY",
  operation="find_replace",
  find_text="- [preference] Use Node.js for scripts",
  content="- [preference] Use Bun for scripts — faster startup, built-in TypeScript (updated 2026-02-27)"
)

# Remove a resolved error note
edit_note(
  identifier="MEMORY",
  operation="find_replace",
  find_text="- [issue] MCP server crashes on reconnect — workaround: restart manually",
  content=""  # removed: fixed in v2.1.0
)
```

### 4. Log the Reflection

Append a brief entry to today's daily note:
```markdown
## Reflection (HH:MM)
- Reviewed: [list of files reviewed]
- Added to MEMORY.md: [brief summary of what was consolidated]
- Removed/updated: [anything cleaned up]
- Net change: MEMORY.md [grew/shrank/unchanged] by ~N lines
```

Tracking net change helps you notice if reflection is actually compacting or just appending.

## Anti-patterns to Avoid

| Anti-pattern | What it looks like | Fix |
|---|---|---|
| **Append-only reflection** | MEMORY.md grows every session, never shrinks | Actively remove entries that no longer add value |
| **Duplication** | Same fact in three places | One authoritative location; use `find_replace` to update, not append |
| **Log preservation** | Keeping failed-attempt logs "just in case" | Strip after resolution; the lesson stays, the log goes |
| **Stale status** | `[status] active` for a project that's done | Update in-place |
| **Over-capturing transients** | "Ran heartbeat at 14:30, all good" × 30 entries | Skip transient activity entirely |

## Guidelines

- **Distill, don't duplicate.** MEMORY.md should be curated wisdom, not a copy of daily notes.
- **Preserve voice.** If the agent has a personality/soul file, reflections should match that voice.
- **Don't delete daily notes.** They're the raw record. Reflection extracts from them; it doesn't replace them.
- **Merge, don't append.** If MEMORY.md already has a section about a topic, update it in place rather than adding a duplicate entry.
- **Flag uncertainty.** If something seems important but you're not sure, add it with `(needs confirmation)` rather than skipping it entirely.
- **Check for filesystem issues.** Look for recursive nesting (`memory/memory/memory/...`), orphaned files, or bloat while gathering material.
