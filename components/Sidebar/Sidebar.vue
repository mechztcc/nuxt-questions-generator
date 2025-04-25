<template>
  <div class="flex flex-col justify-start bg-zinc-50 px-5 py-3 h-screen sticky top-0 left-0" style="width: 260px;">
    <div class="flex flex-col h-full">
      <button :class="['flex py-3 px-5 items-center justify-start w-full hover:bg-purple-400 hover:text-zinc-50 rounded-lg my-1',  item.active() ? 'bg-purple-400 text-zinc-50' : '']" v-for="(item, index) in items" :key="index">
        <Icon :name="item.icon" class="" />
        <span class="mx-3">{{ item.name }}</span>
      </button>
    </div>


    <nuxt-link to="login">
      <div class="flex items-center justify-center mb-3">
        <span>Sair</span>
      </div>
    </nuxt-link>
  </div>

  
</template>

<script setup lang="ts">

const routes = useRoute()



const items = [
  {
    name: "Home",
    icon: "solar:buildings-bold",
    active: () => routes.fullPath.includes(''),
    action: () => {},
  },
  {
    name: "Salvos",
    icon: "solar:bookmark-line-duotone",
    active: () => routes.fullPath.includes('/history'),
    action: () => {},
  },
];
</script>

<style scoped></style>