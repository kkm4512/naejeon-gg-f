<template>
  <div class="rounded-xl overflow-hidden border" :class="result === 'win' ? 'border-blue-800/50' : 'border-red-800/50'">
    <div class="px-4 py-2 font-bold text-sm" :class="result === 'win' ? 'bg-blue-900/40 text-blue-400' : 'bg-red-900/40 text-red-400'">
      {{ result === 'win' ? '🏆 승리팀' : '💀 패배팀' }}
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-white/10 text-gray-500 text-xs">
            <th class="text-left px-4 py-2">소환사</th>
            <th class="text-center px-3 py-2">K/D/A</th>
            <th class="text-center px-3 py-2">KDA</th>
            <th class="text-center px-3 py-2 hidden sm:table-cell">데미지</th>
            <th class="text-center px-3 py-2 hidden sm:table-cell">골드</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="p in players"
            :key="p.summoner"
            class="border-b border-white/5 hover:bg-white/5 transition-colors"
          >
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <ChampionIcon :src="p.champImg" :alt="p.champName" size="sm" />
                <div>
                  <NuxtLink :to="`/summoner/${encodeURIComponent(p.summoner)}`" class="hover:text-accent transition-colors font-medium">
                    {{ p.summoner }}
                  </NuxtLink>
                  <div class="text-xs text-gray-500">{{ p.champName }}</div>
                </div>
              </div>
            </td>
            <td class="text-center px-3 py-3">
              <span>{{ p.kills }}</span>
              <span class="text-gray-600">/</span>
              <span class="text-red-400">{{ p.deaths }}</span>
              <span class="text-gray-600">/</span>
              <span>{{ p.assists }}</span>
            </td>
            <td class="text-center px-3 py-3 font-medium" :class="getKdaColor(Number(p.kda))">{{ p.kda }}</td>
            <td class="text-center px-3 py-3 text-gray-400 hidden sm:table-cell" :class="{ 'text-yellow-400 font-medium': p.damageRaw === maxDamage }">
              {{ p.damage }}
            </td>
            <td class="text-center px-3 py-3 text-gray-400 hidden sm:table-cell" :class="{ 'text-yellow-400 font-medium': p.goldRaw === maxGold }">
              {{ p.gold }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  players: Array<{
    summoner: string
    champName: string
    champImg: string
    kills: number
    deaths: number
    assists: number
    kda: string
    damage: string
    damageRaw: number
    gold: string
    goldRaw: number
  }>
  result: 'win' | 'lose'
}>()

const maxDamage = computed(() => Math.max(...props.players.map(p => p.damageRaw)))
const maxGold = computed(() => Math.max(...props.players.map(p => p.goldRaw)))

function getKdaColor(kda: number) {
  if (kda >= 5) return 'text-yellow-400'
  if (kda >= 3) return 'text-blue-400'
  return 'text-gray-300'
}
</script>
