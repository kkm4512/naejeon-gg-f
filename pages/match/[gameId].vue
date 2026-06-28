<template>
  <div>
    <div v-if="pending" class="text-center py-20 text-gray-500">불러오는 중...</div>
    <div v-else-if="error" class="text-center py-20 text-gray-500">게임을 찾을 수 없습니다.</div>
    <template v-else-if="data">
      <!-- 헤더 -->
      <div class="mb-6">
        <div class="flex items-center gap-3 mb-1">
          <span class="bg-border text-gray-300 text-xs px-2 py-1 rounded">{{ data.mode }}</span>
          <span class="text-gray-500 text-sm">{{ data.duration }}</span>
          <span class="text-gray-600 text-sm">{{ data.date }}</span>
        </div>
        <h1 class="text-xl font-bold text-gray-200">게임 #{{ data.gameId }}</h1>
      </div>

      <!-- 밴 챔피언 -->
      <section class="mb-6" v-if="data.bans.length">
        <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">밴 챔피언</h2>
        <div class="flex flex-wrap gap-2">
          <div v-for="ban in data.bans" :key="ban.name" class="flex items-center gap-1.5 bg-card border border-border rounded-lg px-2 py-1">
            <ChampionIcon :src="ban.img" :alt="ban.name" size="sm" />
            <span class="text-xs text-gray-400">{{ ban.name }}</span>
          </div>
        </div>
      </section>

      <!-- 팀 스코어보드 -->
      <div class="space-y-4">
        <TeamTable :players="data.winTeam" result="win" />
        <TeamTable :players="data.loseTeam" result="lose" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data, pending, error } = await useFetch(`/api/match/${route.params.gameId}`)
</script>
