import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve('src/lib/index.ts'),
      name: 'FormTrek',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    outDir: 'lib',
    emptyOutDir: true,
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'zod'],
      output: {
        globals: {
          react: 'React',
          zod: 'z',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@lib': resolve('src/lib'),
    },
  },
})
