<script lang="ts" setup>
const props = defineProps({
  value: {
    type: Number,
    required: true
  }
})

const style = computed(() => `transform: scaleX(${props.value / 100})`)
</script>

<template>
  <div class="w-full flex flex-col items-end">
<!--    <span class="text-gray-200 mb-1">{{ value }}%</span>-->
    <div class="w-full h-3.5 rounded-2xl bg-gray-400 overflow-hidden">
      <div class="w-full h-3.5 bg-blue-600 origin-top-left" :style="style" />
    </div>
  </div>
</template>
