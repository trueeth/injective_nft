<script lang="ts" setup>
import { Status, StatusType } from '@injectivelabs/utils'
import { LedgerDerivationPathType, Wallet } from '@injectivelabs/wallet-ts'
import { getEthereumAddress } from '@injectivelabs/sdk-ts'
import { WalletConnectStatus } from '@/types'
import type {BaseDropdownOption} from "@injectivelabs/ui-shared/lib/types";

const walletStore = useWalletStore()
const { $onError } = useNuxtApp()
const { handleSubmit } = useForm()

const options = [
  {
    display: 'Ledger Live',
    value: LedgerDerivationPathType.LedgerLive
  },
  {
    display: 'Ledger Legacy',
    value: LedgerDerivationPathType.LedgerMew
  }
] as BaseDropdownOption[]

const path = ref<LedgerDerivationPathType>(LedgerDerivationPathType.LedgerLive)
const status = reactive(new Status(StatusType.Idle))
const fetchStatus = reactive(new Status(StatusType.Idle))

const { value: address, errors: addressErrors } = useStringField({
  name: 'address'
})

onMounted(() => {
  walletStore.$patch({
    addresses: []
  })
})

function fetchAddresses() {
  fetchStatus.setLoading()

  const wallet =
    path.value === LedgerDerivationPathType.LedgerLive
      ? Wallet.Ledger
      : Wallet.LedgerLegacy

  walletStore
    .getHWAddresses(wallet)
    .catch($onError)
    .finally(() => {
      fetchStatus.setIdle()
    })
}

const connect = handleSubmit(() => {
  status.setLoading()

  if (path.value === LedgerDerivationPathType.LedgerMew) {
    return walletStore
      .connectLedgerLegacy(getEthereumAddress(address.value))
      .catch((e) => {
        walletStore.setWalletConnectStatus(WalletConnectStatus.disconnected)
        $onError(e)
      })
      .finally(() => {
        status.setIdle()
      })
  }

  walletStore
    .connectLedger(getEthereumAddress(address.value))
    .catch((e) => {
      walletStore.setWalletConnectStatus(WalletConnectStatus.disconnected)
      $onError(e)
    })
    .finally(() => {
      status.setIdle()
    })
})
</script>

<template>
  <div>
    <p class="text-sm font-semibold mb-2">
      Derivation Path
    </p>
    <AppSelectField
        v-model="path"
        :options="options"
        placeholder="$t('connect.selectDerivationPath')"
    />

    <p
        v-if="fetchStatus.isLoading()"
        class="text-gray-400 text-xs my-2 flex items-center gap-2"
    >
      <AppSpinner is-sm />
      <span>
        We are getting your addresses, please wait ...
      </span>
    </p>

    <div
        v-else
        class="flex items-center gap-1 text-blue-500 hover:text-opacity-80 cursor-pointer text-sm mt-2"
        @click="fetchAddresses"
    >
      <span>
        {{
          walletStore.addresses.length === 0
              ? 'Get addresses'
              : 'Get more addresses'
        }}
      </span>
      <BaseIcon name="arrow" class="rotate-180 w-4 h-4" />
    </div>

    <div class="border-b border-gray-600 mt-4 mb-4" />

    <div v-if="walletStore.addresses.length > 0">
      <p class="text-sm font-semibold mb-2">
        Address
      </p>

      <AppSelectField
          v-model="address"
          is-searchable
          :options="
          walletStore.addresses.map((address: string) => ({
            display: address,
            value: address
          }))
        "
          placeholder="Select address to connect"
      />

      <p
          v-if="addressErrors.length > 0"
          class="text-red-500 text-sm capitalize-phrase mt-1"
      >
        {{ addressErrors[0] }}
      </p>

      <AppButton
          class="w-full mt-4 text-blue-900 bg-blue-500 font-semibold"
          :is-disabled="addressErrors.length > 0"
          :is-loading="status.isLoading()"
          is-lg
          @click="connect"
      >
       Connect
      </AppButton>
    </div>

    <p class="text-xs text-gray-400 mt-4">
      Connect Using Ledger Notes
    </p>
  </div>
</template>
