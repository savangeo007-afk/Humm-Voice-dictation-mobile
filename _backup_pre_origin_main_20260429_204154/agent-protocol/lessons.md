# Pulse AI — Claude Lessons & Coding Rules

> This file is auto-maintained. After every user correction, the relevant rule is updated or added here.
> **Read this file AND `docs/workflow-orchestration.md` at the START of every session before planning or executing any task.**

---

## 0. Pre-Execution Checklist (run mentally before EVERY task)

- [ ] Have I read `docs/lessons.md` (this file) today?
- [ ] Have I read `docs/workflow-orchestration.md` today?
- [ ] Have I read `CLAUDE.md` for context?
- [ ] Do I fully understand what "done" looks like for this task?
- [ ] Will I verify my output before calling the task complete?
- [ ] Am I about to create an unnecessary file? (If yes — stop.)

---

## 1. Task Completion Rules

### Rule T-1 — Never leave a task half-done
Complete every task **fully** before marking it done. Do not stop at "the main part is done". If a task says "add a button that navigates to X", that means the button exists, the navigation param type is updated in `navigation/types.ts`, and the destination screen is reachable — all three.

### Rule T-2 — Always give a brief completion report
At the end of every task, output a concise summary:
- What was done
- Files changed (with line-range references)
- Any known limitations or follow-up notes

### Rule T-3 — Verify before reporting done
Before saying a task is complete, re-read every file you changed and confirm:
1. TypeScript types are consistent
2. No import is broken
3. No `TODO` or placeholder left behind
4. No console error will fire from the change

### Rule T-4 — One task in_progress at a time
Never mark a second task `in_progress` until the first is `completed` in the todo list.

---

## 2. File & Folder Conventions

### Rule F-1 — Context directory is `src/context/` (singular)
Never write `src/contexts/` (plural). The folder is `context` — one word, no s.

### Rule F-2 — Do not create unnecessary markdown files
Only create `.md` files when **explicitly requested**. Temporary notes, changelogs, or feature summaries go in the existing `docs/` folder only when asked.

### Rule F-3 — Docs folder is `docs/` (lowercase, at root)
Not `doc/`, not `documentation/`. The existing directory is `docs/`.

### Rule P-1 � Protocol file read order is mandatory
At session start, read gent-protocol/lessons.md then gent-protocol/workflow-orchestration.md then gent-protocol/CLAUDE.md before planning or executing.
