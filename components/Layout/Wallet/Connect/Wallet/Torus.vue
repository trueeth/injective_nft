<script lang="ts" setup>
import { WalletConnectStatus } from '~/types'

const walletStore = useWalletStore()
const { success } = useNotifications()
const { $onError } = useNuxtApp()

function connect() {
  walletStore
    .connectCosmostation()
    .then(() => {
      success({ title: 'Successfully connected' })
    })
    .catch((e) => {
      walletStore.setWalletConnectStatus(WalletConnectStatus.disconnected)
      $onError(e)
    })
}
</script>

<template>
  <LayoutWalletConnectWrapper @click="connect">
    <template #logo>
      <BaseIcon name="wallet/torus" class="w-8 h-8" />
    </template>

    <template #title>
      Torus
    </template>

    <template #description>
      <span data-cy="connect-wallet-popup-torus-button">
        Connect using torus
      </span>
    </template>

    <template #addon>
      <div class="grid grid-cols-4 gap-4 text-white">
        <BaseIcon name="social/google" is-md />
        <BaseIcon name="social/facebook" is-md />
        <BaseIcon name="social/twitter" is-md />
        <BaseIcon name="social/discord" is-md />
      </div>
    </template>
  </LayoutWalletConnectWrapper>
</template>
