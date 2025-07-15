// vite.config.content.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        content: resolve(__dirname, "src/Content.tsx"),
      },
      output: {
        format: "iife", // removes import/export syntax
        entryFileNames: "content.js", // simple name
        assetFileNames: "[name][extname]", // avoid nested assets
      },
    },
    outDir: "dist", // put content.js directly in dist
    emptyOutDir: false,
    assetsInlineLimit: 0, // don't inline assets,
    minify: false,
  },
});
