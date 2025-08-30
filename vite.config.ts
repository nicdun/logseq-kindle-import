import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import logseqPlugin from "vite-plugin-logseq";

// https://vitejs.dev/config/
const isTest = process.env.VITEST;

export default defineConfig({
  plugins: [react(), ...(isTest ? [] : [logseqPlugin()])],
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
