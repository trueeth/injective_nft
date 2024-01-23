<script setup>
import {
  BusEvents,
  Modal,
  WalletConnectStatus,
  WalletModalType,
} from "~/types";
import { Status, StatusType } from "@injectivelabs/utils";
import { Admin_Address } from "~/app/utils/constants";

const modalStore = useModalStore();
const walletStore = useWalletStore();

const status = reactive(new Status(StatusType.Loading));
const walletModalType = ref(WalletModalType.All);

const router = useRouter();

const isModalOpen = computed(() => modalStore.modals[Modal.Connect]);

const isLoading = computed(
  () => walletStore.walletConnectStatus === WalletConnectStatus.connecting
);

const injAddressShort = computed(
  () =>
    `${walletStore.injectiveAddress.slice(
      0,
      6
    )}...${walletStore.injectiveAddress.slice(-3)}`
);

function handleClick() {
  modalStore.openModal(Modal.Connect);
}

function onCloseModal() {
  modalStore.closeModal(Modal.Connect);
}

onMounted(() => {
  useEventBus(BusEvents.ShowLedgerConnect).on(connectLedger);

  Promise.all([
    walletStore.isMetamaskInstalled(),
    walletStore.isTrustWalletInstalled(),
  ]).finally(() => status.setIdle());
});

function connectLedger() {
  walletModalType.value = WalletModalType.Ledger;

  modalStore.openModal(Modal.Connect);
}

function onWalletModalTypeChange(type) {
  walletModalType.value = type;
}

watch(
  () => walletStore.walletConnectStatus,
  (newWalletConnectStatus) => {
    if (newWalletConnectStatus === WalletConnectStatus.connected) {
      if (walletStore.injectiveAddress === Admin_Address) {
        router.push("/admin");
      }

      modalStore.closeModal(Modal.Connect);
      modalStore.openPersistedModalIfExist();
    }
  }
);

watch(isModalOpen, (newShowModalState) => {
  if (!newShowModalState) {
    onCloseModal();
    walletModalType.value = WalletModalType.All;
  }
});
</script>

<template>
  <LayoutWalletDetails v-if="walletStore.isUserWalletConnected" />
  <Button
    v-else
    @click="handleClick"
    class="bg-blue-500 text-blue-900 font-mono tracking-wide font-bold text-lg whitespace-nowrap"
  >
    Connect Wallet
  </Button>

  <AppModal
    :is-open="isModalOpen"
    :is-loading="isLoading"
    :ignore="['.v-popper__popper']"
    is-md
    @modal:closed="onCloseModal"
  >
    <template #title>
      <h3 v-if="walletModalType === WalletModalType.Trezor">
        Connect Using Trezor
      </h3>
      <h3 v-else-if="walletModalType === WalletModalType.Ledger">
        Connect Using Ledger
      </h3>
      <h3 v-else>Connect To Wallet</h3>
    </template>

    <LayoutWalletLedger v-if="walletModalType === WalletModalType.Ledger" />
    <LayoutWalletTrezor
      v-else-if="walletModalType === WalletModalType.Trezor"
    />
    <ul
      v-else
      class="divide-y divide-gray-800 border-gray-700 rounded-lg max-h-[65vh]"
    >
      <LayoutWalletConnectWalletMetamask />
      <LayoutWalletConnectWalletKeplr />
      <LayoutWalletConnectWalletNinji />
      <LayoutWalletConnectWalletLedger @click="onWalletModalTypeChange" />
      <LayoutWalletConnectWalletTrezor @click="onWalletModalTypeChange" />
      <LayoutWalletConnectWalletTrustWallet />
      <LayoutWalletConnectWalletLeap />
      <LayoutWalletConnectWalletCosmostation />
      <LayoutWalletConnectWalletTorus />
    </ul>
  </AppModal>
</template>
