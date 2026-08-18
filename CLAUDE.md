<!-- @starling-agents GENERATED v0.1.0 — DO NOT EDIT INSIDE THIS BLOCK -->
# CLAUDE.md — icon.gl

Claude Code reads this file. Shared, fleet-wide guidance is maintained in the
`@starling-cloud/agents` control plane and composed into `AGENTS.md` — import it:

@AGENTS.md

Repo classification: vite-app, docs-site · agent-config v0.1.0

- Shared slash commands live in `.claude/commands/` (when present).
- Project MCP servers are declared in `.mcp.json` (when present).
<!-- @starling-agents END GENERATED -->

## CI policy

The only CI in this repo is a deploy / publish / release workflow whose **sole
trigger is a version-tag push**:

```yaml
on:
  push:
    tags:
      - "v[0-9]+.[0-9]+.[0-9]+"
```

Nothing else, ever: no `workflow_dispatch`, no `release:` events, no branch
pushes, no `pull_request`, no `schedule`. Do not add lint, test, smoke, build,
CodeQL, stale, labeler, auto-assign or Dependabot workflows, and no
`.github/dependabot.yml` or other CI systems. Tests and checks run locally;
the tag workflow may run them as part of the release. Redeploying means
pushing a new tag. `.claude/hooks/guard_workflows.py` enforces this for
Claude Code sessions in this repo.
