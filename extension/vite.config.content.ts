import { defineConfig } from "vite";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

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
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "public/*",
          dest: ".",
        },
        {
          src: "index.html",
          dest: ".",
        },
      ],
    }),
  ],
});
