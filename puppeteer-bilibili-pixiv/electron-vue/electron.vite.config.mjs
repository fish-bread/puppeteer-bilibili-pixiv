import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
// noinspection SpellCheckingInspection
import { vite as vidstack } from 'vidstack/plugins'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag.startsWith('media-')
          }
        }
      }),
      vidstack()
    ]
  }
})
