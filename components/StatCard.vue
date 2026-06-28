<template>
  <div class="bg-card border border-border rounded-xl p-5">
    <div class="text-xs text-gray-500 mb-1">{{ label }}</div>
    <div class="text-2xl font-bold text-white">{{ value }}</div>
    <div v-if="sub" class="text-sm text-gray-400 mt-1">{{ sub }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value: string | number; sub?: string }>()
</script>
