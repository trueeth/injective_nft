import {defineConfig} from "vite";
import {nodePolyfills} from "@bangjelkoski/vite-plugin-node-polyfills";
import { type ViteConfig } from 'nuxt/schema'

export default defineConfig({
    define: {
        "process.env": JSON.stringify({}),
        "process.env.DEBUG": JSON.stringify(process.env.DEBUG),
        global:{}
    },

    plugins: [
        nodePolyfills({protocolImports: true})
    ],

    build: {
        sourcemap: false,
        rollupOptions: {
            cache: false,
            output: {
                manualChunks: (id: string) => {
                    if (id.includes('@keplr-wallet')) {
                        return 'keplr'
                    }
                }
            }
        }
    },

    server: {
        fs: {
            allow: ['..']
        }
    },
    optimizeDeps: {
        exclude: ["fsevents"],
    },
}) as ViteConfig;
