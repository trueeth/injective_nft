import { ChainGrpcAuthZApi, ChainGrpcWasmApi } from "@injectivelabs/sdk-ts";
import { Network, getNetworkEndpoints } from "@injectivelabs/networks";
import { MsgBroadcaster } from "@injectivelabs/wallet-ts";
import { walletStrategy } from "./services/wallet";


const env = {
  VITE_FEE_PAYER_PUB_KEY: import.meta.env.VITE_FEE_PAYER_PUB_KEY,
} as {
  VITE_FEE_PAYER_PUB_KEY: string
}
export const FEE_PAYER_PUB_KEY = (env.VITE_FEE_PAYER_PUB_KEY || '') as string

export const NETWORK = Network.Testnet;
export const ENDPOINTS = getNetworkEndpoints(NETWORK);
export const authZApi = new ChainGrpcAuthZApi(ENDPOINTS.grpc)

export const chainGrpcWasmApi = new ChainGrpcWasmApi(ENDPOINTS.grpc);

export const msgBroadcastClient = new MsgBroadcaster({
  walletStrategy,
  network: NETWORK,
});
