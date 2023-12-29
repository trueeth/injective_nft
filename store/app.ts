import { defineStore } from 'pinia'
import { DEFAULT_GAS_PRICE } from '@injectivelabs/sdk-ui-ts'
import { GeneralException } from '@injectivelabs/exceptions'
import { ChainId, EthereumChainId } from '@injectivelabs/ts-types'
import {
    NETWORK,
    CHAIN_ID,
    ETHEREUM_CHAIN_ID,
} from '@/app/utils/constants'
import {
    Modal,
    AppState,
    NoticeBanner,
    TradingLayout,
    OrderbookLayout
} from '@/types'


export interface UserBasedState {
    favoriteMarkets: string[]
    bannersViewed: NoticeBanner[]
    modalsViewed: Modal[]

    preferences: {
        orderbookLayout: OrderbookLayout
        tradingLayout: TradingLayout
        authZManagement: boolean
        subaccountManagement: boolean
        skipTradeConfirmationModal: boolean
    }
}

type AppStoreState = {
    // App Settings
    chainId: ChainId
    gasPrice: string
    ethereumChainId: EthereumChainId

    // Loading States
    state: AppState

    // Dev Mode
    devMode: boolean | undefined

    // User settings
    userState: UserBasedState
}

const initialStateFactory = (): AppStoreState => ({
    // App Settings
    chainId: CHAIN_ID,
    ethereumChainId: ETHEREUM_CHAIN_ID,
    gasPrice: DEFAULT_GAS_PRICE.toString(),

    // Loading States
    state: AppState.Idle,

    // Dev Mode
    devMode: undefined,

    // User settings
    userState: {
        modalsViewed: [],
        bannersViewed: [],
        favoriteMarkets: [],

        preferences: {
            skipTradeConfirmationModal: false,
            orderbookLayout: OrderbookLayout.Default,
            tradingLayout: TradingLayout.Left,
            subaccountManagement: false,
            authZManagement: false
        }
    }
})

export const useAppStore = defineStore('app', {
    state: (): AppStoreState => initialStateFactory(),
    getters: {
        favoriteMarkets: (state: AppStoreState) => {
            return state.userState.favoriteMarkets
        },

        isSubaccountManagementActive: (state: AppStoreState) => {
            return state.userState?.preferences?.subaccountManagement
        },

        isAuthzManagementActive: (state: AppStoreState) => {
            return state.userState?.preferences?.authZManagement
        }
    },
    actions: {
        async init() {
            const appStore = useAppStore()

        },




        queue() {
            const appStore = useAppStore()

            if (appStore.state === AppState.Busy) {
                throw new GeneralException(new Error('You have a pending transaction.'))
            } else {
                appStore.$patch({
                    state: AppState.Busy
                })
            }
        },




        toggleFavoriteMarket(marketId: string) {
            const appStore = useAppStore()

            const cachedFavoriteMarkets = appStore.userState.favoriteMarkets

            const favoriteMarkets = cachedFavoriteMarkets.includes(marketId)
                ? cachedFavoriteMarkets.filter((m) => m !== marketId)
                : [marketId, ...cachedFavoriteMarkets]

            appStore.$patch({
                userState: {
                    ...appStore.userState,
                    favoriteMarkets
                }
            })
        },

        setUserState(userState: Object) {
            const appStore = useAppStore()

            appStore.$patch({ userState })
        },




    }
})
