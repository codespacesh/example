import type { ReactNode } from "react";
import {
  createRootRoute,
  Outlet,
  Link,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import "@/index.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Example App" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] antialiased">
        <header className="fixed top-0 left-0 right-0 z-50 py-4 bg-[var(--color-background)]/80 backdrop-blur-xl border-b border-[var(--color-border)]">
          <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
            <Link
              to="/"
              className="font-semibold text-base tracking-tight"
            >
              Example App
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                to="/"
                className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors [&.active]:text-[var(--color-foreground)]"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors [&.active]:text-[var(--color-foreground)]"
              >
                About
              </Link>
              <Link
                to="/counter"
                className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors [&.active]:text-[var(--color-foreground)]"
              >
                Counter
              </Link>
            </nav>
          </div>
        </header>
        <main className="pt-16">
          <Outlet />
        </main>
      </div>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
