import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3080,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            // Code splitting: séparer les vendors et créer des chunks spécifiques
            manualChunks: (id) => {
              // Chunk pour les bibliothèques PDF (lourd, chargé uniquement quand nécessaire)
              if (id.includes('@react-pdf/renderer') || id.includes('html2canvas') || id.includes('jspdf')) {
                return 'pdf-vendor';
              }
              // Chunk pour la compression (jszip, file-saver)
              if (id.includes('jszip') || id.includes('file-saver')) {
                return 'compression-vendor';
              }
              // Chunk pour les graphiques
              if (id.includes('recharts') || id.includes('d3') || id.includes('victory')) {
                return 'charts-vendor';
              }
              // Chunk pour React et son écosystème (priorité haute) - EXCLURE les autres node_modules
              if (id.includes('react') || id.includes('react-dom') || id.includes('framer-motion')) {
                return 'react-vendor';
              }
              // Chunk pour les autres node_modules (mais pas ceux déjà traités)
              if (id.includes('node_modules') && 
                  !id.includes('react') && 
                  !id.includes('framer-motion') &&
                  !id.includes('@react-pdf') &&
                  !id.includes('html2canvas') &&
                  !id.includes('jspdf') &&
                  !id.includes('jszip') &&
                  !id.includes('file-saver') &&
                  !id.includes('recharts')) {
                return 'vendor';
              }
            },
            // Optimisation des chunks
            chunkFileNames: 'assets/[name]-[hash].js',
            entryFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash][extname]',
          }
        },
        // Réduire la taille du chunk d'avertissement
        chunkSizeWarningLimit: 500,
        // Minification agressive
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          }
        }
      }
    };
});
