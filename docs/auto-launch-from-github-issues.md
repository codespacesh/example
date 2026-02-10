# Auto-Launch Codespace from GitHub Issues

When a GitHub issue gets the `launch-codespace` label, a Coder workspace is automatically created with an AI agent that starts working on the issue.

## How It Works

```
GitHub Issue (labeled) → GitHub Action → Coder CLI → Workspace Created → AI Agent Starts
```

1. A user adds the `launch-codespace` label to a GitHub issue
2. The GitHub Action (`.github/workflows/launch-codespace.yaml`) triggers
3. It generates a branch name from the issue title (e.g., `issue-42-fix-login-bug`)
4. It creates (or updates) a Coder workspace via the CLI, passing issue metadata as parameters
5. The workspace startup script clones the repo, checks out the branch, and starts services
6. The AI agent (Claude Code) receives a structured prompt with the issue details and begins working
7. A comment is posted on the issue with a link to the workspace

## Prerequisites

- A Coder deployment (e.g., `https://noel.codespace.sh`)
- The `dind` or `docker-compose` template pushed to Coder
- A GitHub repo with the workflow and Coder template configured
- Coder External Authentication configured for GitHub (so `gh` CLI works inside workspaces)

## Setup Guide

### 1. Create a Coder API Token

Generate a long-lived token for GitHub Actions to authenticate with Coder:

```bash
coder tokens create --name github-actions --lifetime 8760h
```

> **Note:** If token creation fails with a lifetime error, ensure `CODER_MAX_TOKEN_LIFETIME` and `CODER_MAX_ADMIN_TOKEN_LIFETIME` are set to at least `8760h` on your Coder deployment.

### 2. Set the GitHub Secret

Store the token as a repository secret:

```bash
gh secret set CODER_TOKEN --repo <org>/<repo>
```

### 3. Create the `launch-codespace` Label

```bash
gh label create launch-codespace \
  --description "Auto-launch a Coder workspace for this issue" \
  --color 0E8A16 \
  --repo <org>/<repo>
```

### 4. Add the GitHub Action

Create `.github/workflows/launch-codespace.yaml`:

```yaml
name: Launch Codespace
on:
  issues:
    types: [labeled]

permissions:
  issues: write

jobs:
  launch:
    if: github.event.label.name == 'launch-codespace'
    runs-on: ubuntu-latest
    steps:
      - name: Install Coder CLI
        run: curl -fsSL https://coder.com/install.sh | sh

      - name: Create branch name
        id: branch
        run: |
          SLUG=$(echo "${{ github.event.issue.title }}" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | head -c 40)
          echo "name=issue-${{ github.event.issue.number }}-${SLUG}" >> "$GITHUB_OUTPUT"

      - name: Create or update workspace
        env:
          CODER_URL: https://noel.codespace.sh  # Your Coder URL
          CODER_SESSION_TOKEN: ${{ secrets.CODER_TOKEN }}
        run: |
          WS_NAME="<template>-issue-${{ github.event.issue.number }}"

          if coder show "$WS_NAME" >/dev/null 2>&1; then
            coder update "$WS_NAME" --always-prompt=false \
              --parameter issue_number="${{ github.event.issue.number }}" \
              --parameter issue_title="${{ github.event.issue.title }}" \
              --parameter issue_body="$(echo '${{ toJSON(github.event.issue.body) }}' | jq -r '.')" \
              --parameter issue_branch="${{ steps.branch.outputs.name }}" \
              --parameter "ai_prompt=Working on issue #${{ github.event.issue.number }}"
            coder restart "$WS_NAME" --yes
          else
            coder create "$WS_NAME" --template <template> --yes \
              --parameter cpu=4 \
              --parameter memory=8 \
              --parameter disk_size=50 \
              --parameter issue_number="${{ github.event.issue.number }}" \
              --parameter issue_title="${{ github.event.issue.title }}" \
              --parameter issue_body="$(echo '${{ toJSON(github.event.issue.body) }}' | jq -r '.')" \
              --parameter issue_branch="${{ steps.branch.outputs.name }}" \
              --parameter "ai_prompt=Working on issue #${{ github.event.issue.number }}"
          fi

      - name: Comment on issue
        uses: actions/github-script@v7
        with:
          script: |
            const wsName = `<template>-issue-${context.issue.number}`;
            const coderUrl = 'https://noel.codespace.sh';
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: `Codespace launched: [${wsName}](${coderUrl}/@admin/${wsName})\n\nThe AI agent is working on this issue.`
            });
```

Replace `<template>` with your Coder template name (e.g., `example`).

### 5. Add Claude Code Settings

Create `.claude/settings.json` with permissions for autonomous operation:

```json
{
  "permissions": {
    "allow": [
      "Bash(git *)",
      "Bash(gh *)",
      "Bash(bun *)",
      "Bash(npm *)",
      "Bash(docker compose *)",
      "Bash(docker ps*)",
      "Bash(docker logs*)",
      "Bash(curl *)",
      "Bash(ls *)",
      "Bash(cat *)",
      "Bash(find *)",
      "Bash(grep *)",
      "Bash(mkdir *)",
      "Bash(cp *)",
      "Bash(mv *)",
      "Bash(rm *)",
      "Bash(chmod *)",
      "Bash(echo *)",
      "Bash(which *)",
      "Bash(env)",
      "Bash(pwd)",
      "Bash(head *)",
      "Bash(tail *)",
      "Bash(wc *)",
      "Bash(sort *)",
      "Bash(sed *)",
      "Bash(awk *)",
      "Bash(diff *)"
    ],
    "deny": []
  }
}
```

### 6. Add Project Instructions (CLAUDE.md)

Create a `CLAUDE.md` at the repo root describing your project's stack, dev commands, and structure. This gives the AI agent context about the codebase.

### 7. Push the Coder Template

If you have a CI workflow for template pushes (see below), changes to `coder/` will auto-deploy. Otherwise push manually:

```bash
coder templates push <template> --directory coder --yes
```

### 8. (Optional) Auto-Push Template on Merge

Add `.github/workflows/push-template.yaml` to auto-push template changes:

```yaml
name: Push Coder Template
on:
  push:
    branches: [main]
    paths:
      - "coder/**"

jobs:
  push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Coder CLI
        run: curl -fsSL https://coder.com/install.sh | sh

      - name: Push template
        env:
          CODER_URL: https://noel.codespace.sh
          CODER_SESSION_TOKEN: ${{ secrets.CODER_TOKEN }}
        run: |
          coder templates push <template> --directory coder --yes
```

## Template Parameters

The `dind` and `docker-compose` templates accept these issue-related parameters:

| Parameter | Description |
|-----------|-------------|
| `issue_number` | GitHub issue number |
| `issue_title` | Issue title |
| `issue_body` | Issue body text |
| `issue_branch` | Branch name for the issue |
| `ai_prompt` | Custom prompt for the AI agent (auto-generated from issue if not set) |
| `cpu` | CPU cores (2, 4, 8, 16) |
| `memory` | Memory in GB (4, 8, 16, 32) |
| `disk_size` | Disk size in GB (20-500) |

## How the AI Agent Prompt Works

When `issue_number` is provided, the template auto-generates a structured prompt:

```
You are working on GitHub Issue #42: Fix login bug

## Your task
1. Run `gh issue view 42` to read the full issue and comments
2. Check out the branch: `issue-42-fix-login-bug`
3. Understand the codebase and implement the changes described in the issue
4. Run tests and verify your changes work
5. Commit your changes and push the branch
6. Create a pull request linking to issue #42

## Issue description
<issue body content>
```

If `ai_prompt` is explicitly passed (as in the workflow), it overrides this default.

## Authentication

The workspace uses **Coder External Authentication** for GitHub access. This means `gh` CLI and `git push` work automatically inside workspaces without manual token configuration. Set this up in your Coder deployment's external auth settings.

## Troubleshooting

### Workflow fails with "parameter not present in template"

Ensure the template has been pushed to Coder with the correct parameter names. The CLI `--parameter` flag matches against the `name` field in the template's `coder_parameter` data sources, not `display_name`.

### Workspace creates but AI agent doesn't start

Check the workspace startup logs:
```bash
coder ssh <workspace> -- cat /tmp/coder-startup-script.log
```

### "Resource not accessible by integration" on comment step

Add `permissions: issues: write` to the workflow file.

### Token creation fails with lifetime error

Your Coder deployment may have token lifetime limits. Ensure both `CODER_MAX_TOKEN_LIFETIME` and `CODER_MAX_ADMIN_TOKEN_LIFETIME` are set to at least `8760h` (1 year) in your Coder server configuration.

### Wrong Coder URL

The `CODER_URL` must be the base URL of your Coder deployment (e.g., `https://noel.codespace.sh`), not a subdomain like `https://coder.noel.codespace.sh` which may match wildcard app routing.
