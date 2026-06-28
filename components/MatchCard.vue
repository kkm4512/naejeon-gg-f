<template>
  <NuxtLink
    :to="`/match/${match.id}`"
    class="block bg-card border border-border rounded-xl p-4 hover:border-accent transition-colors"
  >
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <span class="text-xs bg-border px-2 py-0.5 rounded text-gray-300">{{ match.mode }}</span>
        <span class="text-xs text-gray-500">{{ match.duration }}</span>
      </div>
      <span class="text-xs text-gray-500">{{ match.date }}</span>
    </div>
    <div class="grid grid-cols-2 gap-3 text-sm">
      <div>
        <div class="text-blue-400 font-medium mb-1">승리</div>
        <div class="text-gray-300 space-y-0.5">
          <div v-for="p in match.winTeam" :key="p" class="truncate">{{ p }}</div>
        </div>
      </div>
      <div>
        <div class="text-red-400 font-medium mb-1">패배</div>
        <div class="text-gray-300 space-y-0.5">
          <div v-for="p in match.loseTeam" :key="p" class="truncate">{{ p }}</div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  match: {
    id: string
    mode: string
    duration: string
    date: string
    winTeam: string[]
    loseTeam: string[]
  }
}>()
</script>
