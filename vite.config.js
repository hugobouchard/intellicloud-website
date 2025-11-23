import { defineConfig } from 'vite'
import { resolve } from 'path'
import { glob } from 'glob'
import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

// Get all HTML files for multi-page build
const files = glob.sync('src/pages/**/*.html')
const input = {
  main: resolve(__dirname, 'index.html'),
}

files.forEach(file => {
  const name = file.replace('src/pages/', '').replace('/index.html', '').replace('.html', '')
  input[name] = resolve(__dirname, file)
})

// Function to recursively copy directories
function copyDirRecursive(src, dst) {
  mkdirSync(dst, { recursive: true })
  readdirSync(src).forEach(file => {
    const srcPath = join(src, file)
    const dstPath = join(dst, file)
    if (statSync(srcPath).isDirectory()) {
      copyDirRecursive(srcPath, dstPath)
    } else {
      copyFileSync(srcPath, dstPath)
    }
  })
}

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input
    }
  },
  plugins: [
    {
      name: 'preserve-version-directories',
      apply: 'build',
      enforce: 'post',
      writeBundle() {
        // Copy version directories to dist after build
        try {
          copyDirRecursive(resolve(__dirname, 'version'), resolve(__dirname, 'dist/version'))
          console.log('✓ Version directories preserved in dist/')
        } catch (err) {
          console.error('Warning: Could not preserve version directories:', err.message)
        }
      }
    }
  ],
  server: {
    port: 5173,
    open: true,
  },
  preview: {
    port: 4173,
  },
})
