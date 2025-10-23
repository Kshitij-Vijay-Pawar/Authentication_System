import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ["babel-plugin-react-compiler"]
        ],
      },
    }),
    
    tailwindcss(),

  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    target: 'esnext',
    minify: 'esbuild',
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
});
