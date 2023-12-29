<script lang="ts" setup>
</script>

<template>
  <div class="flex items-center justify-between text-xs">
    <span class="font-semibold">
      Tier
    </span>

    <NuxtLink
      :to="{ name: 'index' }"
      class="text-green-500 hover:opacity-80 flex items-center gap-2"
    >
      <span>
        No Tier Level
      </span>
      <BaseIcon name="external-link-arrow" is-xs />
    </NuxtLink>
  </div>
</template>
