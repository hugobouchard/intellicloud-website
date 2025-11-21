import { defineConfig } from 'vite'
import { resolve } from 'path'
import { glob } from 'glob'

// Get all HTML files for multi-page build
const files = glob.sync('src/pages/**/*.html')
const input = {
  main: resolve(__dirname, 'index.html'),
}

files.forEach(file => {
  const name = file.replace('src/pages/', '').replace('/index.html', '').replace('.html', '')
  input[name] = resolve(__dirname, file)
})

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input
    }
  },
  server: {
    port: 5173,
    open: true,
  },
  preview: {
    port: 4173,
  },
})
