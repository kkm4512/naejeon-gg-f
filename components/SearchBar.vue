<template>
  <form @submit.prevent="search" class="flex gap-2">
    <input
      v-model="query"
      type="text"
      placeholder="소환사 이름 검색"
      class="flex-1 bg-card border border-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
    />
    <button
      type="submit"
      class="bg-accent hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
    >
      검색
    </button>
  </form>
</template>

<script setup lang="ts">
const query = ref('')
const router = useRouter()

function search() {
  if (!query.value.trim()) return
  router.push(`/summoner/${encodeURIComponent(query.value.trim())}`)
}
</script>
