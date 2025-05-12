import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    historyApiFallback: true,
    middleware: [
      (req, res, next) => {
        // Redirect all requests that aren't files to index.html
        if (!req.url.includes('.')) {
          req.url = '/index.html';
        }
        next();
      },
    ],
  },
});