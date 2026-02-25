import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import monacoEditorPluginModule from 'vite-plugin-monaco-editor'

const monacoEditorPlugin =
  typeof monacoEditorPluginModule === 'function'
    ? monacoEditorPluginModule
    : (monacoEditorPluginModule as { default: () => Plugin }).default

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    monacoEditorPlugin({
      languageWorkers: ['editorWorkerService', 'json'],
    }) as Plugin,
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
