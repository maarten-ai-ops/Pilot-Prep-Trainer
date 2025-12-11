import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    // Polyfill process.env.API_KEY so the existing service code works without modification.
    // In Vercel, set your environment variable as 'VITE_API_KEY'.
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY)
    },
    server: {
      port: 3000
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    }
  };
});