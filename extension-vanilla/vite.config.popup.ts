import { defineConfig } from "vite";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  build: {
    outDir: "dist-popup",
    minify: "terser",
    rollupOptions: {
      input: resolve(__dirname, "src/popup.ts"),
      output: {
        format: "iife",
        entryFileNames: "popup.js",
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
