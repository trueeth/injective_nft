import nitroConfigHook from "./nuxt-config/hooks/nitro";
import vite from "./nuxt-config/vite";

export default defineNuxtConfig({
    ssr: false,
    builder:'vite',

    typescript: {
        typeCheck: false
    },

    css: ['@/assets/css/tailwind.css'],

    hooks: {
        ...nitroConfigHook,
    },

    modules: [
        '@injectivelabs/ui-shared',
        "@nuxtjs/tailwindcss",
        "@pinia/nuxt",
        "@vueuse/nuxt"
    ],


    sourcemap: {
        server: false,
        client: true,
    },

    imports: {
        dirs: ['composables/**', 'store/*.ts', 'store/**/index.ts'],
    },

    pinia: {
        autoImports: ["defineStore"],
    },

     vite,


    build: {
        transpile: ['typescript-module-or-file'], // Add the TypeScript module or file that you want to transpile
    },

    postcss:{
        plugins: {
            'postcss-import': {},
            'tailwindcss/nesting': {},
        }
    },

});
