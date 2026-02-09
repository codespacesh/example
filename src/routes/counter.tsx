import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/counter")({
  component: CounterPage,
});

function CounterPage() {
  const [count, setCount] = useState(0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-4">Counter</h1>
      <p className="text-lg text-[var(--color-muted-foreground)] mb-8">
        An interactive counter to verify client-side state works correctly.
      </p>

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] p-8 text-center">
        <div className="text-6xl font-bold tabular-nums mb-6">{count}</div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setCount((c) => c - 1)}
            className="px-4 py-2 rounded-md bg-[var(--color-primary)] text-[var(--color-primary-foreground)] text-sm font-medium hover:opacity-85 transition-opacity cursor-pointer"
          >
            Decrement
          </button>
          <button
            onClick={() => setCount(0)}
            className="px-4 py-2 rounded-md border border-[var(--color-border)] text-sm font-medium hover:bg-[var(--color-muted)] transition-colors cursor-pointer"
          >
            Reset
          </button>
          <button
            onClick={() => setCount((c) => c + 1)}
            className="px-4 py-2 rounded-md bg-[var(--color-primary)] text-[var(--color-primary-foreground)] text-sm font-medium hover:opacity-85 transition-opacity cursor-pointer"
          >
            Increment
          </button>
        </div>
      </div>
    </div>
  );
}
