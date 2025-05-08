import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // const env = loadEnv(mode, process.cwd(), '');
  loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      host: true,
    },
  };
});
