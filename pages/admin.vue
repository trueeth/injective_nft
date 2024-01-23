<script setup lang="ts">
import { WalletConnectStatus } from "~/types";
import { Admin_Address } from "~/app/utils/constants";
import { Status, StatusType } from "@injectivelabs/utils";
import { useAppStore } from "#imports";

const router = useRouter();
const walletStore = useWalletStore();
const appStore = useAppStore();
const status = reactive(new Status(StatusType.Idle));

const page = ref(1);
const limit = ref(10);
const totalCount = ref(45);
const round = defineModel("round", { default: 1 });
const supply = defineModel("supply", { default: 8 });

const holdDatas = [
  {
    address: "inj1wu3em28sedzdggqwrl72ll2nmemx2wzxzgvruw",
    tokenIds: [5, 7, 9],
    purchasedAt: "2023 Dec 11",
  },
];

function onLimitChange(value: number) {
  limit.value = Number(value);
}

function onPageChange(value: number) {
  page.value = Number(value);
}

const { error } = useNotifications();

function handleSetRound() {
  if (!walletStore.isUserWalletConnected) {
    error({ title: "Please connect wallet" });
    return;
  }

  status.setLoading();

  appStore
    .setRound(round.value, supply.value)
    .catch(alert)
    .finally(() => {
      status.setIdle();
    });
}

watch(
  () => walletStore.walletConnectStatus,
  (newWalletConnectStatus) => {
    if (
      !(
        newWalletConnectStatus === WalletConnectStatus.connected &&
        walletStore.injectiveAddress === Admin_Address
      )
    ) {
      router.push("/");
    }
  }
);

const holders = computed(() => {
  const holders = appStore.holders;
  if (holders.length > 0) {
    const groupHolders = holders.reduce((result: any, item: any) => {
      const key = item;
      if (!result[key]) {
        result[key] = [];
      }

      result[key].push(item);

      return result;
    }, {});

    const result = Object.entries(groupHolders).map(
      (item: any, index: number) => {
        const tempResult = { address: item[0], balance: item[1].length };
        return tempResult;
      }
    );

    return result;
  } else return [];
});
</script>

<template>
  <Container
    class="place-items-center flex-1 flex flex-row justify-center items-baseline w-full mt-16 font-semibold"
  >
    <div
      class="flex flex-col gap-16 items-center lg:items-start lg:gap-0 lg:flex-row overflow-hidden"
    >
      <div class="w-full lg:w-1/3 flex flex-col lg:pr-12">
        <div class="text-3xl capitalize font-bold mb-6">admin setting</div>

        <div
          class="flex flex-col gap-5 bg-gray-800 rounded-3xl px-4 py-6 pt-10 font-mono"
        >
          <div class="flex flex-col">
            <label class="block">
              <span class="block text-base font-medium capitalize mb-3">
                round
              </span>
              <input
                type="number"
                name="round"
                v-model="round"
                class="mt-1 px-3 py-3 bg-gray-900 border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                placeholder="0"
              />
            </label>
          </div>
          <div class="flex flex-col">
            <label class="block">
              <span class="block text-base font-medium capitalize mb-3">
                supply
              </span>
              <input
                type="number"
                name="round"
                v-model="supply"
                class="mt-1 px-3 py-3 bg-gray-900 border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                placeholder="0"
              />
            </label>
          </div>
          <div class="flex flex-col">
            <label class="block">
              <span class="block text-base font-medium capitalize mb-3">
                token URI
              </span>
              <input
                type="text"
                name="round"
                class="mt-1 px-3 py-3 bg-gray-900 border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                placeholder="https://ipfs.com"
              />
            </label>
          </div>
          <Button
            class="capitalize bg-blue-500 text-blue-900 whitespace-nowrap mx-20 text-base md:text-xl mt-2 tracking-widest"
            @click="handleSetRound"
          >
            start
          </Button>
        </div>
      </div>

      <div class="w-full flex flex-col lg:pl-12">
        <div class="text-3xl capitalize font-bold mb-2">holders</div>

        <div class="lg:min-h-xl overflow-auto">
          <table class="table-auto font-mono">
            <thead>
              <tr>
                <th class="text-xs text-left p-4 whitespace-nowrap">No</th>
                <th class="text-xs text-left p-4 whitespace-nowrap">Address</th>
                <th class="text-xs text-left p-4 whitespace-nowrap">
                  Token IDs
                </th>
                <th class="text-xs text-left p-4 whitespace-nowrap">Balance</th>
                <th class="text-xs text-left p-4 whitespace-nowrap">
                  Purchased At
                </th>
              </tr>
            </thead>
            <tbody v-if="totalCount > 0" class="divide-y divide-gray-800">
              <tr v-for="(item, index) in holders">
                <td class="p-4 whitespace-nowrap">{{ index + 1 }}</td>
                <td class="p-4 whitespace-nowrap">
                  {{ item.address }}
                </td>
                <td class="p-4 whitespace-nowrap">-</td>
                <td class="p-4 whitespace-nowrap">{{ item.balance }}</td>
                <td class="p-4 whitespace-nowrap">-</td>
              </tr>
            </tbody>
          </table>

          <div
            v-if="totalCount <= 0"
            class="w-full my-10 justify-center text-xl items-center flex gap-5 font-mono"
          >
            <img class="h-10 w-10" src="/assets/img/drafts.svg" alt="drafts" />
            <p>No Data</p>
          </div>
        </div>
        <div
          v-if="totalCount > 0"
          class="flex mt-5 font-mono flex-col gap-5 md:gap-0 md:flex-row items-center"
        >
          <Pagination
            v-bind="{
              page,
              limit,
              totalCount,
            }"
            @update:limit="onLimitChange"
            @update:page="onPageChange"
          />

          <Button
            class="capitalize bg-blue-500 text-blue-900 whitespace-nowrap w-1/2 md:w-auto mx-5 md:mx-20 text-sm md:text-base mt-2 tracking-widest"
          >
            export CSV
          </Button>
        </div>
      </div>
    </div>
  </Container>
</template>
