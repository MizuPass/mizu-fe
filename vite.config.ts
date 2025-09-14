import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // TanStack Router plugin must come before React plugin
    tanstackRouter(),
    react(),
    tailwindcss(),
    nodePolyfills({
      include: ['buffer', 'crypto', 'util', 'stream', 'path', 'process'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  optimizeDeps: {
    include: [
      '@zkpassport/sdk',
      'react-qr-code',
      'buffer',
      'debug'
    ],
    exclude: [
      '@zkpassport/registry'
    ]
  },
  resolve: {
    alias: {
      '@noble/curves/utils': '@noble/curves/utils'
    }
  },
  define: {
    global: 'globalThis',
  }
})
