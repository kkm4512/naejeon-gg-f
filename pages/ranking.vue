<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">🏅 랭킹</h1>

    <!-- 필터 -->
    <div class="flex flex-wrap gap-3 mb-6">
      <div class="flex rounded-lg overflow-hidden border border-border">
        <button
          v-for="s in statTabs"
          :key="s.value"
          @click="stat = s.value"
          class="px-3 py-2 text-sm transition-colors"
          :class="stat === s.value ? 'bg-accent text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'"
        >
          {{ s.label }}
        </button>
      </div>
      <div class="flex rounded-lg overflow-hidden border border-border">
        <button
          v-for="m in modeTabs"
          :key="m.value"
          @click="mode = m.value"
          class="px-3 py-2 text-sm transition-colors"
          :class="mode === m.value ? 'bg-accent text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'"
        >
          {{ m.label }}
        </button>
      </div>
    </div>

    <!-- 테이블 -->
    <div v-if="pending" class="text-center py-20 text-gray-500">불러오는 중...</div>
    <div v-else-if="data?.length" class="bg-card border border-border rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border text-gray-500 text-xs">
              <th class="text-left px-4 py-3 w-12">#</th>
              <th class="text-left px-4 py-3">소환사</th>
              <th class="text-center px-3 py-3">게임</th>
              <th class="text-center px-3 py-3">승률</th>
              <th class="text-center px-3 py-3">KDA</th>
              <th class="text-center px-3 py-3">{{ currentStatLabel }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, i) in data"
              :key="row.name"
              class="border-b border-border/50 hover:bg-white/5 transition-colors"
            >
              <td class="px-4 py-3 text-gray-500 font-mono">
                <span v-if="i === 0">🥇</span>
                <span v-else-if="i === 1">🥈</span>
                <span v-else-if="i === 2">🥉</span>
                <span v-else class="text-gray-600">{{ i + 1 }}</span>
              </td>
              <td class="px-4 py-3">
                <NuxtLink :to="`/summoner/${encodeURIComponent(row.name)}`" class="hover:text-accent transition-colors font-medium">
                  {{ row.name }}
                </NuxtLink>
              </td>
              <td class="text-center px-3 py-3 text-gray-400">{{ row.games }}</td>
              <td class="text-center px-3 py-3">
                <span :class="Number(row.winRate) >= 50 ? 'text-blue-400' : 'text-red-400'">{{ row.winRate }}%</span>
              </td>
              <td class="text-center px-3 py-3">{{ row.kda }}</td>
              <td class="text-center px-3 py-3 font-semibold text-white">{{ getStatValue(row) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else class="text-center py-20 text-gray-500">데이터가 없습니다.</div>
  </div>
</template>

<script setup lang="ts">
const statTabs = [
  { label: '킬', value: 'kills' },
  { label: '어시', value: 'assists' },
  { label: '데스', value: 'deaths' },
  { label: '데미지', value: 'damage' },
  { label: '골드', value: 'gold' },
  { label: '승률', value: 'winRate' },
  { label: 'KDA', value: 'kda' },
]
const modeTabs = [
  { label: '전체', value: 'ALL' },
  { label: '협곡', value: 'CLASSIC' },
  { label: '칼바람', value: 'KIWI' },
]

const stat = ref('kills')
const mode = ref('ALL')

const currentStatLabel = computed(() => statTabs.find(s => s.value === stat.value)?.label || '')

const { data, pending, refresh } = await useFetch('/api/ranking', {
  query: computed(() => ({ stat: stat.value, mode: mode.value })),
  watch: [stat, mode],
})

function getStatValue(row: any) {
  if (stat.value === 'kills') return `${row.kills} (평균 ${row.avgKills})`
  if (stat.value === 'assists') return `${row.assists} (평균 ${row.avgAssists})`
  if (stat.value === 'deaths') return `${row.deaths} (평균 ${row.avgDeaths})`
  if (stat.value === 'damage') return row.avgDamage
  if (stat.value === 'gold') return row.gold.toLocaleString('ko-KR')
  if (stat.value === 'winRate') return `${row.winRate}%`
  if (stat.value === 'kda') return row.kda
  return '-'
}
</script>
