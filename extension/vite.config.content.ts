import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: "dist-content",
    minify: "terser",
    rollupOptions: {
      input: resolve(__dirname, "src/content.ts"),
      output: {
        format: "iife",
        entryFileNames: "content.js",
        assetFileNames: "[name].[ext]",
        inlineDynamicImports: true,
      },
    },
  },
});
