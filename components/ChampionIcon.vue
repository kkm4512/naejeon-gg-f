<template>
  <img
    :src="src"
    :alt="alt"
    :class="['rounded-full object-cover bg-gray-800', sizeClass]"
    @error="onError"
  />
</template>

<script setup lang="ts">
const props = defineProps<{ src: string; alt?: string; size?: 'sm' | 'md' | 'lg' }>()
const sizeClass = computed(() => ({
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
}[props.size || 'md']))

function onError(e: Event) {
  (e.target as HTMLImageElement).src = 'https://ddragon.leagueoflegends.com/cdn/img/champion/tiles/Aatrox_0.jpg'
}
</script>
