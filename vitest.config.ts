import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
      '@test': resolve(__dirname, 'test'),
    }
  },
  test: {
    environment: 'node',
    reporters: ['tree'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'html'],
      include: ['app/**'],
      exclude: ['**/*.test.ts'],
    }
  }
})
