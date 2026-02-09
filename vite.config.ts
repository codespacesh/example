import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  build: {
    target: "esnext",
  },
  server: {
    port: 5173,
    host: true,
  },
  plugins: [
    tsConfigPaths(),
    tanstackStart(),
    react(),
    nitro({
      preset: "bun",
    }),
  ],
});
