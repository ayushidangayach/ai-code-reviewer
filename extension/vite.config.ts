import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: "dist",
    minify: "terser",
    rollupOptions: {
      input: {
        content: resolve(__dirname, "src/content.ts"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
        format: "iife",
        manualChunks: {
          vendor: ["marked", "highlight.js", "katex"],
        },
      },
    },
  },
});
