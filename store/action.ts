import { defineStore } from "pinia";
import { chainGrpcWasmApi } from "@/app/services";
import { MINTING_CONTRACT_ADDRESS } from "@/app/utils/constants";
import {
  toBase64,
  fromBase64,
  MsgExecuteContractCompat,
  msgsOrMsgExecMsgs,
  Address,
} from "@injectivelabs/sdk-ts";
import { useWalletStore } from "./wallet";
import { msgBroadcastClient } from "@/app/services";
import { sleep } from "@injectivelabs/utils";
import { backupPromiseCall } from "@/app/utils";

export const useAppStore = defineStore("app", {
  state: () => ({
    count: 0,
    round: 0,
    supply: 0,
    holders: [] as Address[],
  }),
  actions: {
    async getAppInfo() {
      const appStore = useAppStore();

      const resRound = await chainGrpcWasmApi.fetchSmartContractState(
        MINTING_CONTRACT_ADDRESS,
        toBase64({ round_info: {} })
      );

      const { round, supply } = fromBase64(
        Buffer.from(resRound.data).toString("base64")
      ) as { round: number; supply: number };

      const resHolders = await chainGrpcWasmApi.fetchSmartContractState(
        MINTING_CONTRACT_ADDRESS,
        toBase64({ holders: { round: 1 } })
      );
      const { info: holders } = fromBase64(
        Buffer.from(resHolders.data).toString("base64")
      ) as { info: Array<Address> };

      appStore.$patch({ holders: holders });
      appStore.$patch({ count: holders.length });
      appStore.$patch({ supply: supply });
      appStore.$patch({ round: round });
    },

    async mint() {
      const appStore = useAppStore();
      const walletStore = useWalletStore();

      if (!walletStore.injectiveAddress) {
        throw new Error("No Wallet Connected");
      }

      let mintMsg = {
        mint: {
          token_id: `ninja_ponzi_business${appStore.holders.length + 1}`,
          owner: walletStore.injectiveAddress,
          token_uri: "https://ipfs.com",
          extention: "",
        },
      };

      const msg = MsgExecuteContractCompat.fromJSON({
        contractAddress: MINTING_CONTRACT_ADDRESS,
        sender: walletStore.injectiveAddress,
        msg: mintMsg,
      });

      const actualMessage = walletStore.isAuthzWalletConnected
        ? msgsOrMsgExecMsgs(msg, walletStore.injectiveAddress)
        : msg;

      await msgBroadcastClient.broadcast({
        msgs: actualMessage,
        injectiveAddress: walletStore.injectiveAddress,
      });

      await sleep(3000);
      await backupPromiseCall(() => appStore.getAppInfo());
    },

    async setRound(round: number, supply: number) {
      const appStore = useAppStore();
      const walletStore = useWalletStore();

      if (!walletStore.injectiveAddress) {
        throw new Error("No Wallet Connected");
      }

      let setRoundMsg = {
        set_round: {
          round: round,
          supply: supply,
        },
      };

      const msg = MsgExecuteContractCompat.fromJSON({
        contractAddress: MINTING_CONTRACT_ADDRESS,
        sender: walletStore.injectiveAddress,
        msg: setRoundMsg,
      });

      const actualMessage = walletStore.isAuthzWalletConnected
        ? msgsOrMsgExecMsgs(msg, walletStore.injectiveAddress)
        : msg;

      await msgBroadcastClient.broadcast({
        msgs: actualMessage,
        injectiveAddress: walletStore.injectiveAddress,
      });

      await sleep(3000);
      await backupPromiseCall(() => appStore.getAppInfo());
    },
  },
});
