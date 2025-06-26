import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  server: {
    proxy: {
      '/api/langflow': {
        target: 'https://api.langflow.astra.datastax.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/langflow/, ''),
      },
    }
  },
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

