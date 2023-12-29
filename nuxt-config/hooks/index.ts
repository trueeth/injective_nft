import { NuxtHooks } from 'nuxt/schema'
import nitroConfig from './nitro'

export default {
    'build:done'() {
    },

    ...nitroConfig
} as NuxtHooks
