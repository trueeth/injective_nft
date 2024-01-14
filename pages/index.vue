<script setup lang="ts">


import {useCounterStore, useNotifications} from "#imports";
import {Status, StatusType} from "@injectivelabs/utils";

const walletStore = useWalletStore()
const counterStore=useCounterStore()
const status = reactive(new Status(StatusType.Idle))

const {error} = useNotifications()

const mintCount=ref(0)

onMounted(() => {
  counterStore.fetchCount();
});

watch(
    ()=>counterStore.count,
    ()=>{
      mintCount.value= counterStore.count
    }
)

function handleMintClick(){
  if (!walletStore.isUserWalletConnected){
    error({title:'Please connect wallet'})
    return
  }

  status.setLoading()

  counterStore
      .incrementCount()
      .catch(alert)
      .finally(() => {
        status.setIdle();
      });
}

</script>

<template>
  <div class="bg-gray-800 text-white py-2">
    <Container class="py-2 flex justify-between items-center max-w-full mx-4">
      <div>
        <img class="h-10 w-10 hidden sm:block" src="/assets/img/injective.png" alt="injective">
      </div>
      <div class="flex ">
        <div class="flex items-center mr-5 gap-2">
          <img class="h-4 w-4 hover:fill-blue-500" src="/assets/img/twitter.svg" alt="twitter">
          <img class="h-6 w-6" src="/assets/img/discord.svg" alt="discord">
        </div>
        <ConnectWallet/>
      </div>
    </Container>
  </div>
  <Container class="grid place-items-center py-20">
    <div class="relative flex flex-col-reverse lg:flex-row justify-end">
      <div
          class="lg:absolute z-10 lg:left-0 lg:top-1/2 lg:transform lg:-translate-y-1/2 -mt-2 lg:mt-0 sm:px-5 lg:px-0 w-full lg:max-w-md ">
        <div class="bg-gray-800 p-4 sm:p-8 xl:py-14 md:px-10  dark:bg-neutral-900 shadow-lg rounded-3xl space-y-3 sm:space-y-8 text-white text-xl leading-10 font-mono">

          <div
              class="capitalize text-2xl lg:text-3xl lg:leading-[2.5rem] 2xl:text-3xl 2xl:leading-[3rem] font-semibold flex items-end gap-2.5">
            ninja ponzi business
          </div>
          <div class="flex flex-col">
            <div class="flex justify-between">
              <div class="capitalize">round</div>
              <div>1</div>
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
              <div>8</div>
            </div>
            <div class="flex flex-col text-sm mt-3">
              <div class="flex justify-between mb-2 text-gray-400">
                <div class="capitalize">total minted</div>
                <div>{{ mintCount / 10 }}% ({{mintCount}}/1000)</div>
              </div>
              <AppProgress :value="mintCount/10"/>
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

      <div class="w-full lg:w-[64%] relative ">
        <div class=" inset-0 object-cover rounded-3xl sm:rounded-[40px] border-4 sm:border-[14px] border-neutral-800 overflow-hidden">
          <img class="nft" src="/assets/img/NPB_1.jpg" alt="nbp-1">
        </div>
      </div>
    </div>


  </Container>
</template>
