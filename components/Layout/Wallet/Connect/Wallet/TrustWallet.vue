<script lang="ts" setup>
import { WalletConnectStatus } from '~/types'

const walletStore = useWalletStore()
const { success } = useNotifications()
const { $onError } = useNuxtApp()

const downloadTrustWalletLink = ref<any>(null)

function connect() {
  if (walletStore.trustWalletInstalled) {
    walletStore
      .connectTrustWallet()
      .then(() => {
        success({ title: 'Successfully connected' })
      })
      .catch((e) => {
        walletStore.setWalletConnectStatus(WalletConnectStatus.disconnected)
        $onError(e)
      })
  } else if (
    downloadTrustWalletLink.value &&
    downloadTrustWalletLink.value.$el
  ) {
    downloadTrustWalletLink.value.$el.click()
  }
}
</script>

<template>
  <LayoutWalletConnectWrapper @click="connect">
    <template #logo>
      <BaseIcon name="wallet/trust-wallet" class="w-8 h-8" />
    </template>

    <template #title>
      TrustWallet
    </template>

    <template #description>
      <span data-cy="connect-wallet-popup-trust-wallet-button">
        Connect using browser
      </span>
    </template>

    <template v-if="!walletStore.trustWalletInstalled" #icon>
      <NuxtLink
        ref="downloadTrustWalletLink"
        to="https://trustwallet.com/browser-extension/"
        target="_blank"
        rel="noreferrer"
      >
        <svg class="h-5 w-5 fill-white hover:fill-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>
      </NuxtLink>
    </template>
  </LayoutWalletConnectWrapper>
</template>
