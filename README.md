# Example App

A minimal TanStack Start web app with Docker Compose, built as a demo project for the [codespace.sh](https://codespace.sh) DinD (Docker-in-Docker) template.

## Getting Started

### Local Development

```bash
bun install
bun dev
```

Visit http://localhost:5173

### Docker Development

```bash
docker-compose up --build
```

Visit http://localhost:5173 — hot reload is enabled via volume mount.

### Production Build

```bash
bun run build
bun start
```

Visit http://localhost:3000

## Project Structure

```
├── package.json          # Bun, TanStack Start, React 19, Tailwind v4
├── tsconfig.json         # ES2022, bundler resolution, @/* path alias
├── vite.config.ts        # TanStack Start + Nitro (Bun preset)
├── postcss.config.mjs    # Tailwind CSS v4 PostCSS plugin
├── Dockerfile            # Multi-stage production build
├── Dockerfile.dev        # Dev container with hot reload
├── docker-compose.yml    # Single web service for development
└── src/
    ├── index.css         # Tailwind v4 + light/dark CSS variables
    ├── router.tsx        # TanStack Router setup
    └── routes/
        ├── __root.tsx    # Root layout with nav header
        ├── index.tsx     # Home page with feature cards
        ├── about.tsx     # About page with tech stack list
        └── counter.tsx   # Interactive counter with useState
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing page with feature cards |
| `/about` | About page listing the tech stack |
| `/counter` | Interactive counter (increment, decrement, reset) |

## Tech Stack

- **TanStack Start** — Full-stack React framework with file-based routing
- **React 19** — Latest React
- **Vite 7** — Build tool
- **Tailwind CSS v4** — Utility-first CSS
- **Bun** — Runtime and package manager
- **Nitro** — Server engine with Bun preset
- **Docker** — Containerized dev and production environments
