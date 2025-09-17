import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react({
      // Disable fast refresh for better stability
      fastRefresh: true,
    }),
    tailwindcss()
  ],
  server: {
    port: 5173,
    host: true,
  },
  optimizeDeps: {
    exclude: ['@tanstack/react-router-devtools'],
  },
  build: {
    sourcemap: true,
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['@tanstack/react-router'],
          query: ['@tanstack/react-query'],
          forms: ['react-hook-form', '@hookform/resolvers'],
        },
      },
    },
  },
}
)