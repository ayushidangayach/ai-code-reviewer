import { defineConfig } from "vite";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  build: {
    outDir: "dist",
    minify: "terser",
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "src/popup.ts"),
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
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "public/*",
          dest: ".",
        },
      ],
    }),
  ],
});
