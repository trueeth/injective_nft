import { Network, getNetworkEndpoints } from "@injectivelabs/networks";
import { ChainId, EthereumChainId } from "@injectivelabs/ts-types";

export const ALCHEMY_GOERLI_KEY = '';

export const alchemyRpcEndpoint = `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_GOERLI_KEY}`;
export const alchemyWsRpcEndpoint = `wss://eth-goerli.ws.alchemyapi.io/v2/${ALCHEMY_GOERLI_KEY}`;

export const ETHEREUM_CHAIN_ID = EthereumChainId.Goerli;
export const CHAIN_ID = ChainId.Testnet;

export const NETWORK: Network = Network.Testnet;

const endpoints = getNetworkEndpoints(NETWORK)

export const ENDPOINTS = {
  ...endpoints,

}

export const IS_TESTNET: Boolean = [
  Network.Testnet,
  Network.TestnetK8s,
].includes(NETWORK);

export const COUNTER_CONTRACT_ADDRESS =
  "inj1t8rhq5vcxqgw68ldg0k2mjxjvzshuah6tnugvy";




