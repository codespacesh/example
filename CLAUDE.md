# Example App

TanStack Start app with React 19, Vite 7, Tailwind CSS v4, Bun, Nitro.

## Stack
- **Framework:** TanStack Start (SSR + file-based routing)
- **Runtime:** Bun
- **Styling:** Tailwind CSS v4 (CSS-first config)
- **Build:** Vite 7 + Nitro 3 (bun preset)
- **Container:** Docker Compose (Dockerfile.dev)

## Development
The app runs inside Docker on port 5173:
    docker compose up -d --build
    docker compose logs -f
    docker compose down

## Project Structure
- src/routes/ — File-based routes (TanStack Router)
- src/styles/ — Global CSS (Tailwind)
- server/routes/ — Nitro server routes (API endpoints)
- coder/main.tf — Coder workspace template config

## Working with Issues
When launched from a GitHub issue, check the issue details:
    gh issue view $ISSUE_NUMBER

Create a branch, implement changes, then open a PR:
    gh pr create --fill

## Testing
    curl -s http://localhost:5173/ | head -5
    curl -s http://localhost:5173/healthz
