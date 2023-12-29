<script lang="ts" setup>
import { isCosmosWalletInstalled, Wallet } from '@injectivelabs/wallet-ts'
import { WalletConnectStatus } from '~/types'

const walletStore = useWalletStore()
const { success } = useNotifications()
const { $onError } = useNuxtApp()

const isWalletInstalled = isCosmosWalletInstalled(Wallet.Leap)
const downloadCosmostationLink = ref<any>(null)

function connect() {
  if (isWalletInstalled) {
    walletStore
      .connectCosmostation()
      .then(() => {
        success({ title: 'Successfully connected' })
      })
      .catch((e) => {
        walletStore.setWalletConnectStatus(WalletConnectStatus.disconnected)
        $onError(e)
      })
  } else if (
    downloadCosmostationLink.value &&
    downloadCosmostationLink.value.$el
  ) {
    downloadCosmostationLink.value.$el.click()
  }
}
</script>

<template>
  <LayoutWalletConnectWrapper @click="connect">
    <template #logo>
      <BaseIcon name="wallet/cosmostation" class="w-8 h-8" />
    </template>

    <template #title>
      Cosmostation
    </template>

    <template #description>
      <span data-cy="connect-wallet-popup-ledger-button">
        Connect using browser wallet
      </span>
    </template>

    <template v-if="!isWalletInstalled" #icon>
      <NuxtLink
        ref="downloadCosmostationLink"
        to="https://www.cosmostation.io/wallet"
        target="_blank"
        rel="noreferrer"
      >
        <svg class="h-5 w-5 fill-white hover:fill-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>
      </NuxtLink>
    </template>
  </LayoutWalletConnectWrapper>
</template>
