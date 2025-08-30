import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createRequire } from "module";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
const isTest = process.env.VITEST;

// Load logseq plugin which is CommonJS via createRequire
const requireCjs = createRequire(import.meta.url);
const logseqPluginModule = requireCjs("vite-plugin-logseq");
const logseqPlugin = logseqPluginModule.default ?? logseqPluginModule;

export default defineConfig({
  plugins: [tailwindcss(), react(), ...(isTest ? [] : [logseqPlugin()])],
  // Makes HMR available for development
  build: {
    target: "esnext",
    minify: "esbuild",
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [],
  },
});
