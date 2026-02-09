import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-4">
        TanStack Start Example
      </h1>
      <p className="text-lg text-[var(--color-muted-foreground)] mb-12">
        A minimal TanStack Start app with Docker Compose, built to demo the
        codespace.sh DinD template.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card
          title="File-Based Routing"
          description="Routes are defined as files in src/routes/ and automatically discovered by TanStack Router."
        />
        <Card
          title="Docker Compose"
          description="Run the entire app in a container with hot reload using docker-compose up."
        />
        <Card
          title="Bun Runtime"
          description="Uses Bun for fast installs, dev server, and production runtime via Nitro preset."
        />
        <Card
          title="Tailwind CSS v4"
          description="Styled with Tailwind v4 using the new CSS-first configuration and PostCSS plugin."
        />
      </div>
    </div>
  );
}

function Card({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] p-5">
      <h2 className="font-semibold mb-1.5">{title}</h2>
      <p className="text-sm text-[var(--color-muted-foreground)]">
        {description}
      </p>
    </div>
  );
}
