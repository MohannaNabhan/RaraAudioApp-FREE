import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@main': resolve(__dirname, 'src/main')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@preload': resolve(__dirname, 'src/preload')
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@': resolve('src/renderer/src')
      }
    },
    plugins: [react()],
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, './src/renderer/index.html'),
          lostConnection: resolve(__dirname, './src/renderer/lostConnection.html'),
          restart: resolve(__dirname, './src/renderer/restart.html'),
          download: resolve(__dirname, './src/renderer/download.html'),
          login: resolve(__dirname, './src/renderer/login.html')
        }
      }
    }
  }
})
