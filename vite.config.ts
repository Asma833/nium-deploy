import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'react-core': ['react', 'react-dom', 'react-router-dom', 'react-router'],

          // UI Framework chunks
          mui: ['@mui/material', '@mui/lab', '@mui/x-date-pickers'],
          radix: [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
          ],

          // State management
          'state-management': ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],

          // Data handling
          'data-utils': ['@tanstack/react-query', '@tanstack/react-table', 'axios'],

          // Form handling
          'form-tools': ['react-hook-form', '@hookform/resolvers', 'zod'],

          // UI utilities
          'ui-utils': ['framer-motion', 'class-variance-authority', 'tailwind-merge'],
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 1500,
  },
});
