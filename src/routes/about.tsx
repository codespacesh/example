import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  const stack = [
    { name: "TanStack Start", detail: "Full-stack React framework with file-based routing" },
    { name: "React 19", detail: "Latest React with server components support" },
    { name: "Vite 7", detail: "Next-generation frontend build tool" },
    { name: "Tailwind CSS v4", detail: "Utility-first CSS with CSS-first config" },
    { name: "Bun", detail: "Fast JavaScript runtime and package manager" },
    { name: "Nitro", detail: "Server engine with Bun preset for production" },
    { name: "Docker", detail: "Containerized dev and production environments" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-4">About</h1>
      <p className="text-lg text-[var(--color-muted-foreground)] mb-8">
        This example app demonstrates a minimal TanStack Start setup running
        inside Docker, designed as a starter for the codespace.sh DinD template.
      </p>

      <h2 className="text-xl font-semibold mb-4">Tech Stack</h2>
      <ul className="space-y-3">
        {stack.map((item) => (
          <li
            key={item.name}
            className="flex items-start gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] p-4"
          >
            <div>
              <span className="font-medium">{item.name}</span>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                {item.detail}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
