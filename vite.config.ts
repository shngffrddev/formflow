import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@lib': resolve('src/lib'),
      '@demo': resolve('src/demo'),
      '@components': resolve('src/components'),
    },
  },
})
