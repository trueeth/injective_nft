import {defineConfig, UserConfig} from "vite";
import {nodePolyfills} from "@bangjelkoski/vite-plugin-node-polyfills";
import AutoImport from "unplugin-auto-import/vite"

export default defineConfig({
    define: {
        "process.env": JSON.stringify({}),
        "process.env.DEBUG": JSON.stringify(process.env.DEBUG),
    },

    plugins: [
        nodePolyfills({protocolImports: false}),
        AutoImport({
            dirs: ['./composables', './store/**/index.ts'],
            imports: ['vue', '@vueuse/core']
        })
    ],

    build: {
        sourcemap: false,

        rollupOptions: {
            cache: false,
            output: {
                manualChunks: (id: string) => {
                    //
                },
            },
        },
    },

    optimizeDeps: {
        exclude: ["fsevents"],
    },
}) as UserConfig;
