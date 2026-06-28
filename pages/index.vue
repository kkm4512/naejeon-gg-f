<template>
  <div>
    <!-- 히어로 -->
    <section class="text-center py-12">
      <h1 class="text-4xl font-bold mb-2">내전<span class="text-accent">.gg</span></h1>
      <p class="text-gray-400 mb-8">리그 오브 레전드 내전 전적 검색</p>
      <div class="max-w-lg mx-auto">
        <SearchBar />
      </div>
    </section>

    <template v-if="data">
      <!-- 랭킹 하이라이트 -->
      <section class="mb-8">
        <h2 class="text-lg font-bold mb-4 text-gray-200">🏆 누적 랭킹 하이라이트</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            v-if="data.topKill"
            label="최다 킬"
            :value="data.topKill.name"
            :sub="`총 ${data.topKill.value} 킬`"
          />
          <StatCard
            v-if="data.topKda"
            label="최고 KDA"
            :value="data.topKda.name"
            :sub="`KDA ${data.topKda.score}`"
          />
          <StatCard
            v-if="data.topWinRate"
            label="최고 승률"
            :value="data.topWinRate.name"
            :sub="`${data.topWinRate.rate}% (${data.topWinRate.wins}승 ${data.topWinRate.games}게임)`"
          />
        </div>
      </section>

      <!-- 최근 경기 -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-200">📋 최근 내전</h2>
          <NuxtLink to="/matches" class="text-sm text-accent hover:underline">전체보기</NuxtLink>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MatchCard v-for="match in data.recentMatches" :key="match.id" :match="match" />
        </div>
      </section>
    </template>

    <div v-else-if="pending" class="text-center py-20 text-gray-500">불러오는 중...</div>
    <div v-else class="text-center py-20 text-gray-500">데이터가 없습니다.</div>
  </div>
</template>

<script setup lang="ts">
const { data, pending } = await useFetch('/api/summary')
</script>
