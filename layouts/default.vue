<template>
  <div class="bg-gray-900 w-full h-full flex flex-col" >

    <div class="bg-gray-800 text-white py-2 w-full">
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
    <slot />

    <div class="text-gray-400 py-2 mt-10">
      <Container class="py-2 flex justify-center items-center max-w-full mx-4">
        <div class="text-center">
          ©Copyright {{(new Date()).getFullYear()}} www.ninja.com&nbsp;&nbsp; All right reserved
        </div>
      </Container>
    </div>
    <BaseNotifications
        class="z-[1110] fixed inset-0 flex flex-col gap-2 justify-end items-end p-6 pointer-events-none "
    >
      <template #notification="{ notification }">
        <BaseNotification
            :notification="notification"
            class="pointer-events-auto bg-gray-800"
        >
          <template #close="{ closeNotification }">
            <BaseIcon
                name="close-bold"
                class="min-w-4 hover:text-blue-500 text-white w-4 h-4"
                @click="closeNotification"
            />
          </template>
        </BaseNotification>
      </template>
    </BaseNotifications>
  </div>
</template>
<script setup lang="ts">
</script>