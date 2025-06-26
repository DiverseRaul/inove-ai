import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('langflow-')
        }
      }
    })
  ],
  base: process.env.NODE_ENV === 'production' ? '/' : './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})

