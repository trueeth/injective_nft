<script lang="ts" setup>
import { WalletModalType } from '~/types'

const emit = defineEmits<{
  click: [type: WalletModalType]
}>()

function showLedgerModal() {
  emit('click', WalletModalType.Ledger)
}
</script>

<template>
  <LayoutWalletConnectWrapper @click="showLedgerModal">
    <template #logo>
      <BaseIcon name="wallet/ledger" class="w-8 h-8" />
    </template>

    <template #title>
      Ledger
    </template>

    <template #description>
      <span data-cy="connect-wallet-popup-ledger-button">
        Connect using hardware
      </span>
    </template>
  </LayoutWalletConnectWrapper>
</template>
