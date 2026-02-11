# Heredoc Prompt Delivery Verification

**Issue:** #5
**Date:** 2026-02-11
**Status:** VERIFIED

## Summary

The heredoc approach successfully delivers structured prompts to Claude Code in tmux sessions when workspaces are launched from GitHub issues.

## Evidence

### 1. Prompt File Created
Location: `/tmp/claude-prompt-1.txt`

The startup script successfully wrote the prompt to a file using heredoc syntax.

### 2. Prompt Content Verified
The prompt file contains the expected structure:
```
You are working on GitHub Issue #5: Test: verify heredoc prompt delivery

## Your task
1. Run `gh issue view 5` to read the full issue and comments
2. Check out the branch: `issue-5-test-verify-heredoc-prompt-delivery`
3. Understand the codebase and implement the changes
4. Run tests and verify your changes work
5. Commit your changes and push the branch
6. Create a pull request linking to issue #5

## Issue description
Simple test issue to verify that the heredoc approach correctly delivers the prompt to Claude in the tmux session.
```

### 3. Environment Variables Set
All issue-related environment variables were properly passed from the GitHub workflow to the workspace:
- `ISSUE_NUMBER=5`
- `ISSUE_TITLE=Test: verify heredoc prompt delivery`
- `ISSUE_BODY=Simple test issue to verify that the heredoc approach correctly delivers the prompt to Claude in the tmux session.`
- `ISSUE_BRANCH=issue-5-test-verify-heredoc-prompt-delivery`
- `CODER_MCP_CLAUDE_TASK_PROMPT=Working on issue #5`

### 4. Claude Session Started
The startup log confirms:
```
claude-session: claude-1 started (attach with: claude-attach 1)
```

### 5. Prompt Successfully Received
Claude Code instance received and processed the prompt, as evidenced by this verification document being created autonomously based on the task instructions.

## Technical Details

### Workflow Flow
1. GitHub Action triggers on `launch-codespace` label
2. Workflow passes issue metadata as Coder template parameters
3. Coder template (dind module) sets environment variables
4. Startup script generates prompt using heredoc and writes to `/tmp/claude-prompt-1.txt`
5. Startup script launches Claude Code session with the prompt file
6. Claude Code reads and processes the prompt

### Key Components
- **Workflow**: `.github/workflows/launch-codespace.yaml`
- **Template**: `coder/main.tf` (uses dind module)
- **Prompt File**: `/tmp/claude-prompt-1.txt`
- **Session**: `claude-1` (tmux)

## Conclusion

The heredoc prompt delivery mechanism is working as designed. Prompts are correctly:
- Generated from issue metadata
- Written to temporary files using heredoc syntax
- Delivered to Claude Code sessions
- Processed and acted upon by the AI agent

This approach provides a reliable method for launching autonomous AI agents that work on GitHub issues within Coder workspaces.
