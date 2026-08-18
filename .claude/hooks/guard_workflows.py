#!/usr/bin/env python3
"""PreToolUse hook: only version-tag-triggered GitHub Actions workflows.

Policy (see CLAUDE.md, "CI policy"): the only CI this repo runs is a deploy /
publish / release workflow whose *sole* trigger is a push of a version tag.
Concretely, a file under .github/workflows/ must have exactly

    on:
      push:
        tags:
          - "v[0-9]+.[0-9]+.[0-9]+"      # or v*.*.*

and nothing else — no workflow_dispatch, no release:, no branches, no
pull_request, no schedule. Other CI systems (.gitlab-ci.yml, .circleci/,
.travis.yml, Jenkinsfile, ...) and .github/dependabot.yml are not allowed at all.

The hook checks Write / Edit / MultiEdit / NotebookEdit by evaluating the file
content that *would* result, and denies Bash commands that write into a guarded
path (use the Write tool instead so the result can be validated). Deleting is
always allowed.

Escape hatch for a deliberate exception: start the session with
CLAUDE_ALLOW_CI_EDITS=1 in the environment. Stdlib only (macOS system
python3, 3.9+), no PyYAML.
"""

from __future__ import annotations

import json
import os
import re
import shlex
import sys

FILE_TOOLS = {"Read", "Edit", "Write", "NotebookEdit", "MultiEdit"}

# Paths where only version-tag workflows may live.
WORKFLOW_DIR = re.compile(r"(^|/)\.github/workflows/[^/]+\.ya?ml$")
# Paths that may never be created or edited (no allowed form).
FORBIDDEN = re.compile(
    r"(^|/)("
    r"\.github/dependabot\.ya?ml|"
    r"\.gitlab-ci\.ya?ml|"
    r"\.travis\.ya?ml|"
    r"\.circleci/[^/]+|"
    r"azure-pipelines\.ya?ml|"
    r"bitbucket-pipelines\.ya?ml|"
    r"Jenkinsfile|"
    r"\.drone\.ya?ml|"
    r"\.woodpecker\.ya?ml"
    r")$"
)
GUARDED_HINT = re.compile(
    r"\.github/workflows|\.github/dependabot|\.gitlab-ci|\.travis\.yml|\.circleci|"
    r"azure-pipelines|bitbucket-pipelines|Jenkinsfile|\.drone\.yml|\.woodpecker\.yml"
)
WRITEISH = re.compile(
    r"(^|[\s;&|(])(tee|cp|mv|install|rsync|touch|sed\s+-i|perl\s+-[a-z]*i|"
    r"git\s+mv|git\s+checkout|git\s+restore|git\s+apply|patch|truncate|dd)\b|"
    r"[^<]>{1,2}\s*[\"']?[^\s\"']*(\.github/workflows|dependabot|gitlab-ci|circleci|"
    r"travis|azure-pipelines|bitbucket-pipelines|Jenkinsfile|\.drone|\.woodpecker)"
)
VERSION_TAG = re.compile(
    r"^v(\*|\[0-9\]\+|[0-9]+)\.(\*|\[0-9\]\+|[0-9]+)\.(\*|\[0-9\]\+|[0-9]+)$"
)

POLICY = (
    "CI policy: the only allowed trigger is a version-tag push — "
    "`on: push: tags: ['v[0-9]+.[0-9]+.[0-9]+']` and nothing else "
    "(no workflow_dispatch, release, branches, pull_request, schedule). "
    "No lint/test/smoke/CodeQL/stale/auto-assign/Dependabot automation. "
    "See CLAUDE.md. Guard: .claude/hooks/guard_workflows.py "
    "(CLAUDE_ALLOW_CI_EDITS=1 for a deliberate exception)."
)


def resolve(path: str, cwd: str) -> str:
    path = os.path.expanduser(path)
    if not os.path.isabs(path):
        path = os.path.join(cwd, path)
    return os.path.normpath(path)


def _strip_yaml(line: str) -> str:
    """Drop a trailing comment (crudely, but good enough for `on:` blocks)."""
    out, quote = [], None
    for ch in line:
        if quote:
            out.append(ch)
            if ch == quote:
                quote = None
        elif ch in ("'", '"'):
            quote = ch
            out.append(ch)
        elif ch == "#":
            break
        else:
            out.append(ch)
    return "".join(out).rstrip()


def _unquote(s: str) -> str:
    s = s.strip()
    if len(s) >= 2 and s[0] == s[-1] and s[0] in "'\"":
        return s[1:-1]
    return s


def check_workflow(content: str) -> str | None:
    """Return None if the workflow's `on:` block is exactly a version-tag push,
    else a short reason."""
    lines = content.splitlines()
    on_idx = None
    for i, raw in enumerate(lines):
        line = _strip_yaml(raw)
        if re.match(r"""^(on|"on"|'on'|true)\s*:""", line):
            on_idx = i
            break
    if on_idx is None:
        return "no `on:` trigger block found"

    head = _strip_yaml(lines[on_idx])
    inline = head.split(":", 1)[1].strip()
    if inline:
        return f"inline trigger `{inline}` — must be block-style `push: tags:` only"

    # Collect the block: lines indented deeper than column 0 (blank lines ok).
    block = []
    for raw in lines[on_idx + 1:]:
        if raw.strip() == "":
            continue
        if not raw.startswith((" ", "\t")):
            break
        block.append(_strip_yaml(raw))
    block = [b for b in block if b.strip()]
    if not block:
        return "empty `on:` block"

    def indent(s: str) -> int:
        return len(s) - len(s.lstrip(" "))

    top = indent(block[0])
    events = [b for b in block if indent(b) == top]
    keys = [b.strip().rstrip(":").strip() for b in events]
    if keys != ["push"]:
        return f"triggers {keys} — only `push` (with `tags`) is allowed"
    if not events[0].strip().endswith(":") or ":" in events[0].strip()[:-1]:
        return "`push` must be a mapping with only `tags:`"

    push_body = block[1:]
    if not push_body:
        return "`push:` without `tags:`"
    sub = indent(push_body[0])
    push_keys = [b for b in push_body if indent(b) == sub]
    names = [b.strip().rstrip(":").strip().split(":")[0] for b in push_keys]
    if names != ["tags"]:
        return f"push has {names} — only `tags` is allowed (no branches/paths)"
    tags_line = push_keys[0].strip()
    patterns = []
    after = tags_line.split(":", 1)[1].strip()
    if after:
        m = re.match(r"^\[(.*)\]$", after)
        if not m:
            return f"unparseable tags `{after}`"
        patterns = [_unquote(p) for p in m.group(1).split(",") if p.strip()]
    else:
        for b in push_body[1:]:
            s = b.strip()
            if s.startswith("- "):
                patterns.append(_unquote(s[2:]))
            elif s:
                return f"unexpected line under tags: `{s}`"
    if not patterns:
        return "no tag patterns"
    bad = [p for p in patterns if not VERSION_TAG.match(p)]
    if bad:
        return f"tag pattern(s) {bad} are not version tags (use v[0-9]+.[0-9]+.[0-9]+)"
    return None


def deny(reason: str) -> int:
    print(
        json.dumps(
            {
                "hookSpecificOutput": {
                    "hookEventName": "PreToolUse",
                    "permissionDecision": "deny",
                    "permissionDecisionReason": f"{reason} — {POLICY}",
                }
            }
        )
    )
    return 0


def resulting_content(tool: str, tool_input: dict, path: str) -> str | None:
    """Best-effort reconstruction of the file after the edit."""
    if tool == "Write":
        return tool_input.get("content") or ""
    try:
        current = open(path, encoding="utf-8", errors="replace").read()
    except OSError:
        current = ""
    if tool == "Edit":
        old, new = tool_input.get("old_string", ""), tool_input.get("new_string", "")
        if tool_input.get("replace_all"):
            return current.replace(old, new)
        return current.replace(old, new, 1)
    if tool == "MultiEdit":
        for e in tool_input.get("edits") or []:
            old, new = e.get("old_string", ""), e.get("new_string", "")
            current = current.replace(old, new) if e.get("replace_all") else current.replace(old, new, 1)
        return current
    return None


def main() -> int:
    if os.environ.get("CLAUDE_ALLOW_CI_EDITS") == "1":
        return 0
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        return 0

    tool = payload.get("tool_name", "")
    tool_input = payload.get("tool_input") or {}
    cwd = payload.get("cwd") or os.getcwd()

    if tool in FILE_TOOLS and tool != "Read":
        raw = tool_input.get("file_path") or tool_input.get("notebook_path") or ""
        if not raw:
            return 0
        path = resolve(raw, cwd)
        if FORBIDDEN.search(path):
            return deny(f"{path}: this kind of CI/automation config is not allowed in this repo")
        if WORKFLOW_DIR.search(path):
            content = resulting_content(tool, tool_input, path)
            if content is None:
                return deny(f"{path}: cannot validate this edit")
            if content.strip() == "":
                return 0  # emptying a file is as good as deleting it
            problem = check_workflow(content)
            if problem:
                return deny(f"{path}: {problem}")
        return 0

    if tool == "Bash":
        command = tool_input.get("command") or ""
        if not GUARDED_HINT.search(command):
            return 0
        if WRITEISH.search(command) or re.search(r"<<-?\s*['\"]?\w+", command):
            return deny(
                "this shell command writes into a CI config path; use the Write/Edit "
                "tool so the guard can validate the trigger block"
            )
        return 0

    return 0


if __name__ == "__main__":
    sys.exit(main())
