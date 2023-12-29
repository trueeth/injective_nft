import { defineStore } from "pinia";
import {
  connect,
  getAddresses, walletStrategy
} from "@/app/services/wallet";
import {getDefaultSubaccountId, getEthereumAddress, getInjectiveAddress} from "@injectivelabs/sdk-ts";
import {Wallet} from "@injectivelabs/wallet-ts";
import {BusEvents, GrantDirection, WalletConnectStatus} from "~/types";
import {isTrustWalletInstalled} from "~/app/services/trust-wallet";
import {isMetamaskInstalled} from "~/app/services/metamask";
import {confirmCorrectKeplrAddress} from "~/app/services/cosmos";


type WalletStoreState = {
  wallet: Wallet

  address: string
  addresses: string[]
  injectiveAddress: string
  defaultSubaccountId: string
  addressConfirmation: string

  trustWalletInstalled: boolean
  metamaskInstalled: boolean

  walletConnectStatus: WalletConnectStatus

  authZ: {
    address: string
    direction: GrantDirection
    injectiveAddress: string
    defaultSubaccountId: string
  }
}

const initialStateFactory = (): WalletStoreState => ({
  address: '',
  addresses: [],
  injectiveAddress: '',
  defaultSubaccountId: '',
  addressConfirmation: '',
  wallet: Wallet.Metamask,
  metamaskInstalled: false,
  trustWalletInstalled: false,
  walletConnectStatus: WalletConnectStatus.idle,

  authZ: {
    address: '',
    direction: GrantDirection.Grantee,
    injectiveAddress: '',
    defaultSubaccountId: ''
  }
})

export const useWalletStore = defineStore("wallet", {
  state: (): WalletStoreState => initialStateFactory(),

  getters:{
    isUserWalletConnected: (state) => {
      const addressConnectedAndConfirmed =
          !!state.address && !!state.addressConfirmation
      const hasAddresses = state.addresses.length > 0

      return (
          hasAddresses && addressConnectedAndConfirmed && !!state.injectiveAddress
      )
    },
  },

  actions: {
    async init() {
      const walletStore = useWalletStore()

      if (!walletStore.wallet) {
        return
      }
      await connect({ wallet: walletStore.wallet })
    },

    async connectWallet(wallet : Wallet) {
      const walletStore = useWalletStore()

      walletStore.$patch({
        wallet,
        walletConnectStatus: WalletConnectStatus.connecting
      })

      await connect({ wallet })
    },

    async connectMetamask() {
      const walletStore = useWalletStore()

      await walletStore.connectWallet(Wallet.Metamask)

      const addresses = await getAddresses()
      const [address] = addresses
      const addressConfirmation = await walletStrategy.confirm(address)
      const injectiveAddress = getInjectiveAddress(address)

      walletStore.$patch({
        address,
        addresses,
        injectiveAddress,
        addressConfirmation,
        defaultSubaccountId: getDefaultSubaccountId(injectiveAddress)
      })

      await walletStore.onConnect()
    },

    async isMetamaskInstalled() {
      const walletStore = useWalletStore()

      walletStore.$patch({
        metamaskInstalled: await isMetamaskInstalled()
      })
    },

    async onConnect() {
      // const accountStore = useAccountStore()
      const walletStore = useWalletStore()
      // const authZStore = useAuthZStore()
      // const exchangeStore = useExchangeStore()

      useEventBus(BusEvents.WalletConnected).emit()

      // await accountStore.fetchAccountPortfolio()
      // await exchangeStore.initFeeDiscounts()
      // await authZStore.fetchGrants()

      // amplitudeWalletTracker.submitWalletConnectedTrackEvent({
      //   wallet: walletStore.wallet,
      //   address: walletStore.injectiveAddress,
      //   tierLevel: exchangeStore.feeDiscountAccountInfo?.tierLevel || 0
      // })

      walletStore.$patch({
        walletConnectStatus: WalletConnectStatus.connected
      })
    },

    async isTrustWalletInstalled() {
      const walletStore = useWalletStore()

      walletStore.$patch({
        trustWalletInstalled: await isTrustWalletInstalled()
      })
    },

    reset() {
      const walletStore = useWalletStore()

      const {
        address,
        addresses,
        injectiveAddress,
        defaultSubaccountId,
        addressConfirmation
      } = initialStateFactory()

      walletStore.$patch({
        address,
        addresses,
        injectiveAddress,
        defaultSubaccountId,
        addressConfirmation
      })
    },

    async connectCosmostation() {
      const walletStore = useWalletStore()

      await walletStore.connectWallet(Wallet.Cosmostation)

      const injectiveAddresses = await getAddresses()
      const [injectiveAddress] = injectiveAddresses
      const addressConfirmation = await walletStrategy.confirm(injectiveAddress)
      const ethereumAddress = getEthereumAddress(injectiveAddress)

      walletStore.$patch({
        injectiveAddress,
        addressConfirmation,
        address: ethereumAddress,
        addresses: injectiveAddresses,
        defaultSubaccountId: getDefaultSubaccountId(injectiveAddress)
      })

      await walletStore.onConnect()
    },

    async connectKeplr() {
      const walletStore = useWalletStore()

      await walletStore.connectWallet(Wallet.Keplr)

      const injectiveAddresses = await getAddresses()
      const [injectiveAddress] = injectiveAddresses
      const addressConfirmation = await walletStrategy.confirm(injectiveAddress)
      const ethereumAddress = getEthereumAddress(injectiveAddress)

      await confirmCorrectKeplrAddress(injectiveAddress)

      walletStore.$patch({
        injectiveAddress,
        addressConfirmation,
        address: ethereumAddress,
        addresses: injectiveAddresses,
        defaultSubaccountId: getDefaultSubaccountId(injectiveAddress)
      })

      await walletStore.onConnect()
    },

    async connectLeap() {
      const walletStore = useWalletStore()

      await walletStore.connectWallet(Wallet.Leap)

      const injectiveAddresses = await getAddresses()
      const [injectiveAddress] = injectiveAddresses
      const addressConfirmation = await walletStrategy.confirm(injectiveAddress)
      const ethereumAddress = getEthereumAddress(injectiveAddress)

      walletStore.$patch({
        injectiveAddress,
        addressConfirmation,
        address: ethereumAddress,
        addresses: injectiveAddresses,
        defaultSubaccountId: getDefaultSubaccountId(injectiveAddress)
      })

      await walletStore.onConnect()
    },

    async connectNinji() {
      const walletStore = useWalletStore()

      await walletStore.connectWallet(Wallet.Ninji)

      const injectiveAddresses = await getAddresses()
      const [injectiveAddress] = injectiveAddresses
      const addressConfirmation = await walletStrategy.confirm(injectiveAddress)
      const ethereumAddress = getEthereumAddress(injectiveAddress)

      walletStore.$patch({
        injectiveAddress,
        addressConfirmation,
        address: ethereumAddress,
        addresses: injectiveAddresses,
        defaultSubaccountId: getDefaultSubaccountId(injectiveAddress)
      })

      await walletStore.onConnect()
    },

    async connectTrustWallet() {
      const walletStore = useWalletStore()

      await walletStore.connectWallet(Wallet.TrustWallet)

      const addresses = await getAddresses()
      const [address] = addresses
      const addressConfirmation = await walletStrategy.confirm(address)
      const injectiveAddress = getInjectiveAddress(address)

      walletStore.$patch({
        address,
        addresses,
        injectiveAddress,
        addressConfirmation,
        defaultSubaccountId: getDefaultSubaccountId(injectiveAddress)
      })

      await walletStore.onConnect()
    },

    async disconnect() {
      const walletStore = useWalletStore()

      await walletStrategy.disconnect()

      walletStore.reset()
    },

    setWalletConnectStatus(walletConnectStatus: WalletConnectStatus) {
      const walletStore = useWalletStore()

      walletStore.$patch({
        walletConnectStatus
      })
    },

  },
});
