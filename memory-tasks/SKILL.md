---
name: memory-tasks
description: "Task management via Basic Memory schemas: create, track, and resume structured tasks that survive context compaction. Applies 12-factor-agents principles: stateless reducer framing (Factor 12), unified execution state (Factor 5), and explicit pause/resume protocols (Factor 6)."
---

# Memory Tasks

Manage work-in-progress using Basic Memory's schema system. Tasks are just notes with `type: Task` — they live in the knowledge graph, validate against a schema, and survive context compaction.

---

> **Factor 12 — Stateless Reducer:** Your Copilot CLI session is stateless. The Task note IS the execution state — not a record of it.
>
> **Each session follows this loop:**
> 1. **Read state** — `search_notes(note_types=["task"], status="active")`
> 2. **Process** — execute the `current_step`
> 3. **Write state** — update `current_step`, `context`, checkboxes
> 4. **Exit** — the note holds everything the next session needs
>
> If it's not in the task note, it doesn't exist after `/compact`.

---


## When to Use

- **Starting multi-step work** (3+ steps, or anything that might outlast the context window)
- **After compaction/restart** — search for active tasks to resume
- **Pre-compaction flush** — update all active tasks with current state
- **On demand** — user asks to create, check, or manage tasks

## Task Schema

Tasks use the BM schema system (SPEC-SCHEMA). The schema note lives at `memory/schema/Task.md`:

```yaml
---
title: Task
type: schema
entity: Task
version: 1
schema:
  description: string, what needs to be done
  status?(enum): [active, blocked, done, abandoned], current state
  assigned_to?: string, who is working on this
  steps?(array): string, ordered steps to complete
  current_step?: integer, which step number we're on (1-indexed)
  context?: string, key context needed to resume after memory loss
  started?: string, when work began
  completed?: string, when work finished
  blockers?(array): string, what's preventing progress
  parent_task?: Task, parent task if this is a subtask
settings:
  validation: warn
---
```

## Creating a Task

When work qualifies, create a task note. Use `write_note` with `note_type="Task"` and put queryable fields in `metadata`:

```python
write_note(
  title="Descriptive task name",
  directory="tasks",
  note_type="Task",
  metadata={
    "status": "active",
    "priority": "high",
    "current_step": 1,
    "steps": ["First step", "Second step", "Third step"]
  },
  tags=["task"],
  content="""# Descriptive task name

## Observations
- [description] What needs to be done, concisely
- [status] active
- [assigned_to] claude
- [current_step] 1

## Steps
1. [ ] First concrete step
2. [ ] Second concrete step
3. [ ] Third concrete step

## Context
What future-you needs to pick up this work. Include:
- Key file paths and repos involved
- Decisions already made and why
- What was tried and what worked/didn't
- Where to look for related context"""
)
```

### Why Both Frontmatter and Observations? (Factor 5)

> **Factor 5 — Unified Execution State:** The task note is the single source of truth. Frontmatter and observations serve *different roles* — they are not redundant:
>
> - **Frontmatter** (`metadata`) → powers `search_notes` with `metadata_filters`. This is how agents *find* tasks by status, priority, etc.
> - **Observations** (`- [status] active`) → powers `schema_validate`. This is how the schema system checks conformance.
>
> Keep `status` and `current_step` in both. For all other fields, pick the location that makes semantic sense and be consistent.

Don't let the two diverge — if frontmatter says `status: done` but observations say `[status] active`, you have a split-brain state. Keep them in sync.

### Key Principles

- **Steps are concrete and checkable** — "Implement X in file Y", not "figure out stuff"
- **Context is for post-amnesia resumption** — Write it as if explaining to a smart person who knows nothing about what you've been doing
- **Relations link to other entities** — `parent_task [[Other Task]]`, `related_to [[Some Note]]`
- **`note_type` is case-sensitive** — `write_note(note_type="Task")` stores the type as lowercase `task` in frontmatter. Use `note_types=["task"]` (lowercase) in search queries.

## Resume Protocol (Factor 6)

On session start or after compaction, follow this sequence exactly:

```
1. SEARCH   → search_notes(note_types=["task"], status="active")
2. READ     → read_note(identifier="<task-permalink>")
3. VALIDATE → confirm current_step matches the step checkboxes
4. CONTINUE → execute the next unchecked step
```

**Why validate step before continuing?** Context compaction can leave step counts stale. Cross-check `current_step` against the checkbox list — the checkboxes are the ground truth.

```python
# Step 1: Find active work
search_notes(note_types=["task"], status="active")

# Step 2: Read the full task
read_note(identifier="tasks/my-active-task")

# Step 3: Validate — last checked box matches current_step
# If current_step=3 but steps 1, 2, 3 are all checked → someone forgot to update → fix it
# If steps 1, 2 are checked but current_step=3 → correct, continue with step 3
```

## Pause Protocol (Factor 6)

Run this before any `/compact` event, end of session, or before any long-running tool call that might trigger compaction:

```
1. FIND ALL   → search_notes(note_types=["task"], status="active")
2. FOR EACH   → update current_step, context, and step checkboxes
3. VERIFY     → read_note to confirm the update landed correctly
```

**What to write in `context` before pausing:**
- What you just completed (1 sentence)
- What the next step requires (key inputs, file paths, decisions)
- Any blockers discovered
- Anything that would be frustrating to re-discover

```python
edit_note(
  identifier="tasks/my-active-task",
  operation="find_replace",
  find_text="## Context\nWhat future-you needs...",
  content="""## Context
Completed: Implemented the database migration script at db/migrate/001.py.
Next: Run migration against staging. Need DATABASE_URL env var (check .env.staging).
Blocker: None.
Note: The migration is idempotent — safe to re-run if interrupted."""
)
```

Context not written before `/compact` is context permanently lost.

## Updating Tasks

As work progresses, update the task note:

```markdown
## Steps
1. [x] First step — done, resulted in X
2. [x] Second step — done, changed approach because Y
3. [ ] Third step — next up

## Context
Updated context reflecting current state...
```

Update frontmatter too:
```yaml
current_step: 3
```

## Completing Tasks

When done:
```yaml
status: done
completed: YYYY-MM-DD
```

Add a brief summary of what was accomplished and any follow-up needed.


## Querying Tasks

With BM's schema system, tasks are fully queryable:

| Query | What it finds |
|-------|--------------|
| `search_notes(note_types=["task"])` | All tasks |
| `search_notes(note_types=["task"], status="active")` | Active tasks |
| `search_notes(note_types=["task"], status="blocked")` | Blocked tasks |
| `search_notes(note_types=["task"], metadata_filters={"assigned_to": "claude"})` | My tasks |
| `search_notes("blockers", note_types=["task"])` | Tasks with blockers |
| `schema_validate(noteType="Task")` | Validate all tasks against schema |
| `schema_diff(noteType="Task")` | Detect drift between schema and actual task notes |

## Guidelines

- **One task per unit of work** — Don't cram multiple projects into one task
- **Externalize early** — If you think "I should remember this", write it down NOW — not after the next tool call
- **Context > steps** — Steps tell you what to do; context tells you why and how
- **Close finished tasks** — Don't leave completed work as `active`
- **Link related tasks** — Use `parent_task [[X]]` or relations to connect related work
- **Schema validation is your friend** — Run `schema_validate(noteType="Task")` periodically to catch incomplete tasks
