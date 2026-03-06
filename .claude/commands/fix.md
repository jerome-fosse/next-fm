---
description: Fix a bug from BUGS.md autonomously in the background
argument-hint: [bug-number]
allowed-tools: Agent
---

Launch the `bug-fixer` agent in the background with `isolation: "worktree"` to fix bug **$ARGUMENTS**.

Pass the following as the agent prompt:
"Fix bug $ARGUMENTS as described in BUGS.md."

Once the agent is launched, tell the user that the fix is running in the background and that they will be notified when it is done — either with a PR link if the fix succeeded, or with an explanation if it could not be completed.

Do not do anything else. Do not interact with the user until the agent reports back.
