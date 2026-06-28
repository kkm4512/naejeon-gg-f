<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">📋 전적 목록</h1>

    <!-- 모드 필터 -->
    <div class="flex rounded-lg overflow-hidden border border-border w-fit mb-6">
      <button
        v-for="m in modeTabs"
        :key="m.value"
        @click="mode = m.value; page = 1"
        class="px-4 py-2 text-sm transition-colors"
        :class="mode === m.value ? 'bg-accent text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'"
      >
        {{ m.label }}
      </button>
    </div>

    <div v-if="pending" class="text-center py-20 text-gray-500">불러오는 중...</div>
    <template v-else-if="data">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <MatchCard v-for="match in data.matches" :key="match.id" :match="match" />
      </div>

      <!-- 페이지네이션 -->
      <div class="flex items-center justify-center gap-2" v-if="data.totalPages > 1">
        <button
          @click="page--"
          :disabled="page <= 1"
          class="px-4 py-2 rounded-lg border border-border text-sm transition-colors disabled:opacity-30 hover:border-accent"
        >
          이전
        </button>
        <span class="text-sm text-gray-500">{{ page }} / {{ data.totalPages }}</span>
        <button
          @click="page++"
          :disabled="page >= data.totalPages"
          class="px-4 py-2 rounded-lg border border-border text-sm transition-colors disabled:opacity-30 hover:border-accent"
        >
          다음
        </button>
      </div>
    </template>
    <div v-else class="text-center py-20 text-gray-500">데이터가 없습니다.</div>
  </div>
</template>

<script setup lang="ts">
const modeTabs = [
  { label: '전체', value: 'ALL' },
  { label: '협곡', value: 'CLASSIC' },
  { label: '칼바람', value: 'KIWI' },
]

const mode = ref('ALL')
const page = ref(1)

const { data, pending } = await useFetch('/api/matches', {
  query: computed(() => ({ mode: mode.value, page: page.value })),
  watch: [mode, page],
})
</script>
