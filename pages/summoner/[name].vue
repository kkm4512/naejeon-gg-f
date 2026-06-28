<template>
  <div>
    <div v-if="pending" class="text-center py-20 text-gray-500">불러오는 중...</div>
    <div v-else-if="!data?.stats" class="text-center py-20">
      <div class="text-gray-400 text-lg mb-2">소환사를 찾을 수 없습니다.</div>
      <div class="text-gray-600 text-sm">{{ name }}</div>
    </div>
    <template v-else>
      <!-- 소환사 헤더 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-1">{{ data.summoner }}</h1>
        <p class="text-gray-500 text-sm">총 {{ data.stats.games }}게임</p>
      </div>

      <!-- 종합 통계 -->
      <section class="mb-8">
        <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">종합 통계</h2>
        <div class="bg-card border border-border rounded-xl p-5">
          <div class="flex flex-col sm:flex-row items-center gap-6">
            <!-- 승률 도넛 -->
            <div class="flex flex-col items-center">
              <div class="relative w-24 h-24">
                <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#0f3460" stroke-width="3.8" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke="#1e6fc7"
                    stroke-width="3.8"
                    :stroke-dasharray="`${data.stats.winRate} ${100 - Number(data.stats.winRate)}`"
                    stroke-linecap="round"
                  />
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <span class="text-xl font-bold">{{ data.stats.winRate }}%</span>
                </div>
              </div>
              <div class="text-xs text-gray-500 mt-2">{{ data.stats.wins }}승 {{ data.stats.losses }}패</div>
            </div>

            <!-- 수치 -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1 w-full">
              <div class="text-center">
                <div class="text-2xl font-bold">{{ data.stats.kda }}</div>
                <div class="text-xs text-gray-500">KDA</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold">
                  <span class="text-white">{{ data.stats.avgKills }}</span>
                  <span class="text-gray-500 text-base"> / </span>
                  <span class="text-red-400">{{ data.stats.avgDeaths }}</span>
                  <span class="text-gray-500 text-base"> / </span>
                  <span class="text-white">{{ data.stats.avgAssists }}</span>
                </div>
                <div class="text-xs text-gray-500">평균 K/D/A</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold">{{ data.stats.avgDamage }}</div>
                <div class="text-xs text-gray-500">평균 데미지</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold">{{ data.stats.avgGold }}</div>
                <div class="text-xs text-gray-500">평균 골드</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 챔피언별 통계 -->
      <section class="mb-8" v-if="data.champStats.length">
        <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">챔피언별 통계</h2>
        <div class="bg-card border border-border rounded-xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-border text-gray-500 text-xs">
                  <th class="text-left px-4 py-3">챔피언</th>
                  <th class="text-center px-3 py-3">게임</th>
                  <th class="text-center px-3 py-3">승률</th>
                  <th class="text-center px-3 py-3">KDA</th>
                  <th class="text-center px-3 py-3 hidden sm:table-cell">평균 K/D/A</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="c in data.champStats" :key="c.champName" class="border-b border-border/50 hover:bg-white/5">
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                      <ChampionIcon :src="c.champImg" :alt="c.champName" size="sm" />
                      <span>{{ c.champName }}</span>
                    </div>
                  </td>
                  <td class="text-center px-3 py-3 text-gray-400">{{ c.games }}</td>
                  <td class="text-center px-3 py-3">
                    <span :class="Number(c.winRate) >= 50 ? 'text-blue-400' : 'text-red-400'">{{ c.winRate }}%</span>
                  </td>
                  <td class="text-center px-3 py-3 font-medium">{{ c.avgKda }}</td>
                  <td class="text-center px-3 py-3 text-gray-400 hidden sm:table-cell">
                    {{ c.avgKills }} / <span class="text-red-400">{{ c.avgDeaths }}</span> / {{ c.avgAssists }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- 최근 게임 목록 -->
      <section>
        <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">최근 게임</h2>
        <div class="space-y-2">
          <NuxtLink
            v-for="g in data.recentGames"
            :key="g.gameId"
            :to="`/match/${g.gameId}`"
            class="flex items-center gap-3 p-3 rounded-xl border transition-colors hover:border-accent"
            :class="g.win ? 'bg-blue-900/20 border-blue-800/50' : 'bg-red-900/20 border-red-800/50'"
          >
            <div class="w-10 text-center">
              <div :class="g.win ? 'text-blue-400' : 'text-red-400'" class="font-bold text-sm">{{ g.win ? '승' : '패' }}</div>
              <div class="text-xs text-gray-500">{{ g.mode }}</div>
            </div>
            <ChampionIcon :src="g.champImg" :alt="g.champName" size="md" />
            <div class="flex-1 min-w-0">
              <div class="font-medium text-sm">{{ g.champName }}</div>
              <div class="text-xs text-gray-500">{{ g.kills }}/{{ g.deaths }}/{{ g.assists }}</div>
            </div>
            <div class="text-right hidden sm:block">
              <div class="text-sm text-gray-400">{{ g.damage }}</div>
              <div class="text-xs text-gray-600">{{ g.date }}</div>
            </div>
          </NuxtLink>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const name = decodeURIComponent(route.params.name as string)
const { data, pending } = await useFetch(`/api/summoner/${encodeURIComponent(name)}`)
</script>
