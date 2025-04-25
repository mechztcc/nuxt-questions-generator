<template>
  <div
    class="flex flex-col justify-start bg-zinc-50 px-5 py-3 h-screen sticky top-0 left-0"
    style="width: 260px"
  >
    <div class="flex items-center  mt-5">
      <Icon name="solar:user-circle-broken" class="" size="1.5em" />
      <span class="text-zinc-800 mx-3">{{ user }}</span>
    </div>
    <hr class="w-full mb-5 mt-3">

    <div class="flex flex-col h-full">
      <button
        :class="[
          'flex py-3 px-5 items-center justify-start w-full hover:bg-zinc-800 hover:text-zinc-50 rounded-lg my-1',
          item.active() ? 'bg-zinc-800 text-zinc-50' : '',
        ]"
        v-for="(item, index) in items"
        :key="index"
      >
        <Icon :name="item.icon" class="" />
        <span class="mx-3">{{ item.name }}</span>
      </button>
    </div>

    <nuxt-link to="login">
      <div class="flex items-center justify-center mb-3 hover:bg-zinc-900 hover:text-zinc-50 py-3 px-5 rounded-lg">
        <span>Sair</span>
      </div>
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';

const routes = useRoute();

const storage = useLocalStorage('credentials', null)

const user = computed(() => {
  const parsed = JSON.parse(storage.value ?? '')
  return parsed.name ?? 'Usuário não encontrado'
})

const items = [
  {
    name: "Home",
    icon: "solar:buildings-bold",
    active: () => routes.fullPath.includes(""),
    action: () => {},
  },
  {
    name: "Salvos",
    icon: "solar:bookmark-line-duotone",
    active: () => routes.fullPath.includes("/history"),
    action: () => {},
  },
];
</script>

<style scoped></style>
