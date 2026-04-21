---
name: memory-defrag
description: "Defragment and reorganize agent memory files: split bloated files, merge duplicates, remove stale information, and restructure the memory hierarchy. Use when memory files have grown unwieldy, contain redundancies, or need reorganization. Run periodically (weekly) or on demand."
---

# Memory Defrag

Reorganize memory files for clarity, efficiency, and relevance. Defrag combats [context rot and context distraction](https://github.com/tyler555g/best-practices/blob/main/packages/content/technology_and_information/data_science_and_ai/context-engineering.md) — stale or noisy entries that degrade agent behavior when notes are retrieved.

## When to Run

- **Periodic**: Weekly or biweekly via cron (recommended)
- **On demand**: User asks to clean up, reorganize, or defrag memory
- **Threshold**: When MEMORY.md exceeds ~500 lines or daily notes accumulate without consolidation

## Process

### 1. Audit Current State

Inventory all memory files:
```
MEMORY.md           — long-term memory
memory/             — daily notes, tasks, topical files
memory/tasks/       — active and completed tasks
```

For each file, note: line count, last modified, topic coverage, staleness.

### 2. Identify Problems

Look for these common issues:

| Problem | Signal | Fix |
|---------|--------|-----|
| **Bloated file** | >300 lines, covers many topics | Split into focused files |
| **Duplicate info** | Same fact in multiple places | Consolidate to one location |
| **Stale entries** | References to completed work, old dates, resolved issues | Remove or archive |
| **Resolved error traces** | Debugging logs, failed-attempt history, closed-issue workarounds | Remove — context noise once resolved |
| **Orphan files** | Files in memory/ that are never referenced or updated | Review, merge, or remove |
| **Inconsistencies** | Contradictory information across files | Resolve to ground truth |
| **Poor organization** | Related info scattered across files | Restructure by topic |
| **Recursive nesting** | `memory/memory/memory/...` directories | Delete nested dirs (indexer bug artifact) |

### Resolved Error Traces

Resolved error traces deserve special attention:
- Debugging step-by-step logs from incidents that are now closed
- "Tried X, failed because Y" histories where the issue is resolved
- Workaround instructions for bugs that have been fixed
- Error symptoms and their old diagnoses when the root cause is gone

**Why they're harmful:** When retrieved as context, they look like current problems. A fresh agent reading "reconnect loop crashes the server — workaround: restart manually" doesn't know it was fixed last week. This creates false alerts and wastes context budget on phantom issues.

**The rule:** Once an issue is resolved and the fix is documented or deployed, remove the error trace. If there's a lesson worth preserving, distill it to a `[lesson]` observation — one line, not a log.

```python
# Before: three lines of stale error context
# - [issue] MCP server crashes on reconnect — repro: disconnect and reconnect rapidly
# - [workaround] Restart the MCP server manually after each disconnect
# - [status] investigating

# After: one line of distilled lesson
edit_note(
  identifier="MEMORY",
  operation="find_replace",
  find_text="- [issue] MCP server crashes on reconnect — repro: disconnect and reconnect rapidly\n- [workaround] Restart the MCP server manually after each disconnect\n- [status] investigating",
  content="- [lesson] MCP reconnect stability: fixed in v2.1.0 — upgrade if seeing crashes #mcp"
)
```

### 3. Plan Changes

Before making edits, write a brief plan:
```markdown
## Defrag Plan
- [ ] Split MEMORY.md "Key People" section → memory/people.md
- [ ] Remove resolved error traces from MEMORY.md
- [ ] Move completed tasks older than 30 days from memory/tasks/ to archive
- [ ] Merge memory/bm-marketing-ideas.md into memory/competitive/
- [ ] Update stale project status entries in MEMORY.md
```

### 4. Execute

Apply changes one at a time:
- **Split**: Extract sections from large files into focused topical files
- **Merge**: Combine related small files into coherent documents
- **Prune**: Remove information that is no longer relevant or accurate
- **Restructure**: Move files to appropriate directories, rename for clarity
- **Update**: Fix outdated facts, dates, statuses
- **Strip error traces**: Remove resolved debugging history — leave only lessons

### 5. Verify & Log

After changes:
- Verify no valuable information was lost (compare before/after)
- Update any cross-references between files
- Log what was done in today's daily note:

```markdown
## Memory Defrag (HH:MM)
- Files reviewed: N
- Split: [list]
- Merged: [list]
- Pruned: [list]
- Error traces removed: [count]
- Net result: X files, Y total lines (was Z lines)
```

## Guidelines

- **Preserve raw daily notes.** Don't delete or modify `memory/YYYY-MM-DD.md` files — they're the audit trail.
- **Target 15-25 focused files.** Too few means bloated files; too many means fragmentation. Aim for the sweet spot.
- **File names should be scannable.** Use descriptive names: `people.md`, `project-status.md`, `competitive-landscape.md` — not `notes-2.md`.
- **Don't over-organize.** One level of directories is usually enough. `memory/tasks/` and `memory/competitive/` are fine; `memory/work/projects/active/basic-memory/notes/` is not.
- **Completed tasks**: Tasks with `status: done` older than 14 days should be archived (not deleted). Their insights should already be in MEMORY.md via reflection.
- **Ask before destructive changes.** If uncertain whether information is still relevant, keep it with a `(review needed)` tag rather than deleting.
- **Distill, don't just remove.** When pruning error traces or stale observations, ask if there's a one-line lesson worth keeping before deleting entirely.
