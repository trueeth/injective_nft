import { defineConfig } from 'vitest/config'
import AutoImport from 'unplugin-auto-import/vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import viteConfig from './vite.config'
import { mergeConfig } from 'vite'


export default mergeConfig(
    viteConfig,
    {
        plugins: [
            vue() as any,
            AutoImport({
                dirs: ['./composables', './store/', './store/**/index.ts'],
                imports: ['vue', '@vueuse/core']
            })
        ],
        test: {
            test: {
                globals: true,
                environment: 'jsdom',
                include: ['tests/unit/**/*.test.ts', 'src/**/*.spec.ts'],
                root: fileURLToPath(new URL('./', import.meta.url)),
                setupFiles: ['./tests/setup/testglobals.ts'],
                coverage: {
                    // exclude: ['__mocks__/*', 'tests/*', '**/*.spec.ts'],
                    provider: 'v8',
                    reporter: ['text', 'json', 'json-summary'],
                    lines: 75,
                    branches: 65,
                    functions: 0,
                    statements: 65,
                },
            },
        },

    })
