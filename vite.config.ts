import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      'firebase/firestore': 'firebase/firestore'
    }
  },
  server: {
    // Handle client-side routing
    historyApiFallback: true,
  },
  preview: {
    // Handle client-side routing in preview mode
    historyApiFallback: true,
  },
  build: {
    // Generate 404.html for static hosting
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth', 'firebase/storage']
        }
      }
    }
  }
});