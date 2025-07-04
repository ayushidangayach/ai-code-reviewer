import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup.tsx'),
        content: resolve(__dirname, 'src/content.tsx'),
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
    outDir: 'public',
    emptyOutDir: false,
    sourcemap: false,
    minify: true,
  },
}); 