# Auto-Launch Codespace from GitHub Issues

When a GitHub issue gets the `launch-codespace` label, a Coder workspace is automatically created with an AI agent that starts working on the issue.

## How It Works

```
GitHub Issue (labeled) → GitHub Action → Coder CLI → Workspace Created → Claude Code Starts
```

1. A user adds the `launch-codespace` label to a GitHub issue
2. The GitHub Action (`.github/workflows/launch-codespace.yaml`) triggers
3. It generates a branch name from the issue title (e.g., `issue-42-fix-login-bug`)
4. It creates (or updates) a Coder workspace via the CLI, passing issue metadata as parameters
5. The workspace startup script clones the repo, checks out the branch, and starts services
6. Claude Code starts in a tmux session with a structured prompt containing the issue details
7. A comment is posted on the issue with a link to the workspace

## Prerequisites

- A Coder deployment (e.g., `https://noel.codespace.sh`)
- The template pushed to Coder (auto-pushed on merge via `push-template.yaml`)
- GitHub secrets configured: `CODER_TOKEN`, `CLAUDE_CODE_OAUTH_TOKEN`
- Coder External Authentication configured for GitHub (so `gh` CLI works inside workspaces)

## Setup Guide

### 1. Create a Coder API Token

Generate a long-lived token for GitHub Actions to authenticate with Coder:

```bash
coder tokens create --name github-actions --lifetime 8760h
```

> **Note:** If token creation fails with a lifetime error, ensure `CODER_MAX_TOKEN_LIFETIME` and `CODER_MAX_ADMIN_TOKEN_LIFETIME` are set to at least `8760h` on your Coder deployment.

### 2. Set GitHub Secrets

```bash
# Coder authentication
gh secret set CODER_TOKEN --repo <org>/<repo>

# Claude Code authentication (get token via: claude setup-token)
gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo <org>/<repo>
```

### 3. Create the `launch-codespace` Label

```bash
gh label create launch-codespace \
  --description "Auto-launch a Coder workspace for this issue" \
  --color 0E8A16 \
  --repo <org>/<repo>
```

### 4. Configure the Coder Template

Create `coder/main.tf` that consumes the dind template module:

```hcl
variable "claude_code_oauth_token" {
  type      = string
  sensitive = true
  default   = ""
}

module "workspace" {
  source = "git::https://github.com/codespacesh/templates.git//dind/module"

  project_name            = "myproject"
  git_repos               = { "myproject" = "https://github.com/org/myproject" }
  claude_code_oauth_token = var.claude_code_oauth_token

  services = {
    app = { port = 3000, public = true, healthcheck = true, healthcheck_path = "/" }
  }
}
```

### 5. Add Claude Code Settings

Create `.claude/settings.json` with permissions for autonomous operation:

```json
{
  "permissions": {
    "allow": [
      "Bash",
      "Read",
      "Write",
      "Edit",
      "Glob",
      "Grep",
      "WebFetch",
      "WebSearch",
      "mcp__coder__*",
      "mcp__playwright__*"
    ],
    "deny": [
      "Bash(git push --force*)",
      "Bash(git push -f*)",
      "Bash(git push * --force*)",
      "Bash(git push * -f*)",
      "Bash(git push origin main*)",
      "Bash(git push origin master*)",
      "Bash(git checkout main)",
      "Bash(git checkout master)",
      "Edit(.claude/settings.json)",
      "Write(.claude/settings.json)"
    ]
  }
}
```

### 6. Add Project Instructions (CLAUDE.md)

Create a `CLAUDE.md` at the repo root describing your project's stack, dev commands, and structure. This gives the AI agent context about the codebase.

### 7. Add the GitHub Workflows

See `.github/workflows/launch-codespace.yaml` and `.github/workflows/push-template.yaml` in this repo for working examples.

## Claude Code Sessions

Claude Code runs in numbered tmux sessions inside the workspace. The startup script (`claude-session`) automatically launches `claude-1` when an issue is assigned. It builds a prompt from the issue metadata and delivers it to Claude via a heredoc on stdin, so Claude starts working immediately without interactive input.

### Attaching to a session

```bash
# SSH into the workspace
coder ssh <workspace>

# Attach to the Claude session (auto-selects if only one)
claude-attach

# Attach to a specific session
claude-attach 1

# List all active sessions
claude-attach
```

### Launching additional sessions

```bash
# Start another Claude session (auto-numbers to next available)
claude-session

# Start a specific numbered session
claude-session 3
```

Detach from any session with `Ctrl+B, D`.

## Template Parameters

| Parameter | Description |
|-----------|-------------|
| `issue_number` | GitHub issue number |
| `issue_title` | Issue title |
| `issue_branch` | Branch name for the issue |
| `ai_prompt` | Custom prompt for the AI agent (auto-generated from issue if not set) |
| `cpu` | CPU cores (2, 4, 8, 16) |
| `memory` | Memory in GB (4, 8, 16, 32) |
| `disk_size` | Disk size in GB (20-500) |

## Authentication

### Coder Token (`CODER_TOKEN`)

Used by GitHub Actions to create/update workspaces. Create with `coder tokens create`.

### Claude Code OAuth Token (`CLAUDE_CODE_OAUTH_TOKEN`)

Used by Claude Code for API authentication. Generate with `claude setup-token` (requires Claude Pro or Max subscription). Passed through the template as a Terraform variable and set as an environment variable inside the workspace.

### GitHub Access

The workspace uses **Coder External Authentication** for GitHub access. This means `gh` CLI and `git push` work automatically inside workspaces without manual token configuration.

## Troubleshooting

### Claude session starts but no prompt

Check the startup logs:
```bash
coder ssh <workspace> -- cat /tmp/coder-startup-script.log | tail -10
```

Verify Claude is running:
```bash
coder ssh <workspace> -- 'ps aux | grep claude | grep -v grep'
```

### Workflow fails with "parameter not present in template"

Ensure the template has been pushed to Coder. The push-template workflow runs automatically when `coder/` changes.

### Workspace creates but AI agent doesn't start

Check `CLAUDE_CODE_OAUTH_TOKEN` is set:
```bash
coder ssh <workspace> -- 'test -n "$CLAUDE_CODE_OAUTH_TOKEN" && echo "set" || echo "not set"'
```

### "Resource not accessible by integration" on comment step

Add `permissions: issues: write` to the workflow file.

### Token creation fails with lifetime error

Your Coder deployment may have token lifetime limits. Ensure both `CODER_MAX_TOKEN_LIFETIME` and `CODER_MAX_ADMIN_TOKEN_LIFETIME` are set to at least `8760h` (1 year) in your Coder server configuration.
