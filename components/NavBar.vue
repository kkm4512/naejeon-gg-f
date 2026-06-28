<template>
  <nav class="bg-card border-b border-border sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
      <NuxtLink to="/" class="text-xl font-bold text-accent tracking-tight">내전.gg</NuxtLink>
      <div class="flex items-center gap-4 text-sm text-gray-400">
        <NuxtLink to="/matches" class="hover:text-white transition-colors">전적목록</NuxtLink>
        <NuxtLink to="/ranking" class="hover:text-white transition-colors">랭킹</NuxtLink>
      </div>
    </div>
  </nav>
</template>
