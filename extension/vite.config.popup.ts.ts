import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist/popup",
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(__dirname, "src/popup.tsx"),
      output: {
        entryFileNames: "popup.js",
        format: "iife",
        assetFileNames: () => "ignored", // Don't output any assets
      },
    },
    target: "es2022",
    minify: true,
    assetsInlineLimit: 0, // Don't inline any assets
  },
});
