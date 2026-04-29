# Workflow Orchestration

> Read this at the start of every session. Apply every rule to every task, no exceptions.

---

## 1. Plan Mode Default

- Enter plan mode for any non-trivial task (3+ steps or architectural decisions).
- If execution goes sideways — **stop, replan, do not keep pushing**.
- Use plan mode for verification steps, not just building.
- Write detailed specs up front to remove ambiguity before touching code.

---

## 2. Subagent Strategy

- Use subagents liberally to keep the main context window clean.
- Offload: research, exploration, parallel analysis.
- For complex tasks: throw more compute at breadth via parallel subagents.
- One task per subagent — focused execution, not multi-purpose.

---

## 3. Self-Improvement Loop

- After any user correction → update `agent-protocol/lessons.md` immediately.
- Write a rule that prevents the exact same mistake.
- Ruthlessly iterate until the mistake rate drops.
- Review `agent-protocol/lessons.md` at the start of every session for the active project.

---

## 4. Verification Before Done

- Never mark a task complete without **proving** it works.
- Diff behavior between old and new when relevant.
- Ask yourself: *Would a staff engineer approve this?*
- Run tests, check logs, demonstrate correctness — every time.
- For Android native startup fixes, verify Debug CMake flags/macros (no forced global `CMAKE_BUILD_TYPE=Release` / `NDEBUG`) before declaring the crash resolved.

---


## 5. Elegance

- For non-trivial changes: pause and ask *Is there a more elegant way?*
- If a fix feels hacky → implement the clean solution instead.
- For simple, obvious fixes: do not over-engineer. **Keep it simple.**
- Challenge your own work before presenting it.

---

## 6. Autonomous Bug Fixing

- When given a bug report: **just fix it**. No handholding requests.
- Identify the error or failing test → resolve it completely.
- Zero context-switching required from the user.
- Fix failing CI tests without being told how.

---

## 7. Task Management

```
a. Write the plan to a todo list (TodoWrite) with checkable items.
b. Verify the plan before starting implementation.
c. Mark items complete as you go — one at a time.
d. Give a high-level summary at each step.
e. Document results; add a review note at the end of the task.
f. Capture lessons → update docs/lessons.md after any correction.
```

---

## Core Principles

**Simplicity First**
- Every change as simple as possible.
- Minimal code impact.
- Find root causes — no temporary fixes.

**Senior Developer Standards**
- Touch only what's necessary.
- Never introduce new bugs while fixing old ones.
- This is what makes you useful to the developer.
