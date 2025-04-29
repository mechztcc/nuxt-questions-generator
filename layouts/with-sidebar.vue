<template>
  <div class="flex relative">
    <Loader v-if="loader.isLoading" />
    <Sidebar />

    <div class="w-full my-10">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useLoaderStore } from "~/stores/loader";

const loader = useLoaderStore();

</script>

<style></style>
