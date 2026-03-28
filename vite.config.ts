import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@lib': resolve(__dirname, 'src/lib'),
      '@demo': resolve(__dirname, 'src/demo'),
      '@components': resolve(__dirname, 'src/components'),
    },
  },
})
