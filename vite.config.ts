import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import EnvironmentPlugin from 'vite-plugin-environment'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    EnvironmentPlugin('all')
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: './src/setupTests.ts',
  }
})

