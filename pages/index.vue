<script setup lang="ts">
import { useAppStore, useNotifications } from "#imports";
import { Status, StatusType } from "@injectivelabs/utils";

const walletStore = useWalletStore();
const appStore = useAppStore();
const status = reactive(new Status(StatusType.Idle));

const { error } = useNotifications();

const mintCount = ref(0);
const supply = ref(0);
const round = ref(0);

onMounted(() => {
  appStore.getAppInfo();
});

watch(
  () => appStore.count,
  () => {
    mintCount.value = appStore.count;
  }
);

watch(
  () => appStore.supply,
  () => {
    supply.value = appStore.supply;
  }
);

watch(
  () => appStore.round,
  () => {
    round.value = appStore.round;
  }
);

function handleMintClick() {
  if (!walletStore.isUserWalletConnected) {
    error({ title: "Please connect wallet" });
    return;
  }

  status.setLoading();

  appStore
    .mint()
    .catch(alert)
    .finally(() => {
      status.setIdle();
    });
}
</script>

<template>
  <Container class="grid place-items-center flex-1 my-5">
    <div class="relative flex flex-col-reverse lg:flex-row justify-end">
      <div
        class="lg:absolute z-10 lg:left-0 lg:top-1/2 lg:transform lg:-translate-y-1/2 -mt-2 lg:mt-0 sm:px-5 lg:px-0 w-full lg:max-w-md"
      >
        <div
          class="bg-gray-800 p-4 sm:p-8 xl:py-14 md:px-10 dark:bg-neutral-900 shadow-lg rounded-3xl space-y-3 sm:space-y-8 text-white text-xl leading-10 font-mono"
        >
          <div
            class="capitalize text-2xl lg:text-3xl lg:leading-[2.5rem] 2xl:text-3xl 2xl:leading-[3rem] font-semibold flex items-end gap-2.5"
          >
            ninja ponzi business
          </div>
          <div class="flex flex-col">
            <div class="flex justify-between">
              <div class="capitalize">round</div>
              <div>{{ round }}</div>
            </div>
            <div class="flex justify-between">
              <div class="capitalize">mint price</div>
              <div class="uppercase">0.1 inj</div>
            </div>
            <div class="flex justify-between">
              <div class="capitalize">tokens permint</div>
              <div>1</div>
            </div>
            <div class="flex justify-between">
              <div class="capitalize">supply</div>
              <div>{{ supply }}</div>
            </div>
            <div class="flex flex-col text-sm mt-3">
              <div class="flex justify-between mb-2 text-gray-400">
                <div class="capitalize">total minted</div>
                <div>
                  {{ supply ? (mintCount * 100) / supply : 0 }}% ({{
                    mintCount
                  }}/{{ supply }})
                </div>
              </div>
              <AppProgress :value="(mintCount * 100) / supply" />
            </div>
            <Button
              :disabled="status.isLoading()"
              @click="handleMintClick"
              class="capitalize bg-blue-500 text-blue-900 whitespace-nowrap mx-20 text-xl mt-10 tracking-widest"
            >
              mint
            </Button>
          </div>
        </div>
      </div>

      <div class="w-full lg:w-[64%] relative">
        <div
          class="inset-0 object-cover rounded-3xl sm:rounded-[40px] border-4 sm:border-[14px] border-neutral-800 overflow-hidden"
        >
          <img class="nft" src="/assets/img/NPB_1.jpg" alt="nbp-1" />
        </div>
      </div>
    </div>

    <div
      class="fixed inset-0 z-50 h-full w-full duration-300 ease-in backdrop-filter backdrop-blur bg-gray-900 bg-opacity-90 max-sm:z-40 hidden modal-container overflow-y-hidden mx-auto sm:rounded-lg max-sm:h-full max-sm:max-w-full max-sm:w-full md:min-w-lg md:max-w-lg lg:max-w-2xl max-h-screen sm:max-h-[90vh]"
    ></div>
  </Container>
</template>
