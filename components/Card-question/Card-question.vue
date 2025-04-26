<template>
  <div
    @click="onHandle"
    :class="{
      'flex flex-col justify-between bg-zinc-50 px-5 py-5 mt-10 h-full card rounded-lg border-2 border-transparent': true,
      'border-zinc-800 ': selected,
    }"
  >
    <div class="flex">
      <div class="relative group">
        <div
          class="flex items-center justify-center w-fit px-2 py-2 rounded-full cursor-pointer bg-zinc-800"
        >
          <Icon name="solar:cassette-broken" class="text-zinc-50" />
        </div>

        <span
          class="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
        >
          Gerada por IA
        </span>
      </div>

      <div class="relative group mx-1">
        <div
          :class="{
            'flex items-center justify-center w-fit px-2 py-2 rounded-full cursor-pointer': true,
            'bg-green-200': question.level == 'fácil',
            'bg-indigo-300': question.level == 'normal',
            'bg-red-200': question.level == 'difícil',
          }"
        >
          <Icon
            name="solar:star-bold"
            class="text-zinc-50"
            v-for="(item, index) in starsLevels"
            :key="index"
          />
        </div>

        <span
          class="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
        >
          {{ question.level }}
        </span>
      </div>
    </div>
    <span class="mt-3"> {{ question.title }}</span>

    <div class="flex justify-end">
      <div class="relative group" @click="onShowQuestion()">
        <div
          class="flex items-center justify-center w-fit px-2 py-2 rounded-full cursor-pointer hover:bg-zinc-200"
        >
          <Icon name="solar:folder-open-broken" />
        </div>

        <span
          class="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
        >
          Detalhes
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IQuestion } from "~/interfaces/question.interface";

const props = defineProps<{
  question: IQuestion;
  markable: boolean;
}>();

const selected = ref<boolean>();
const emits = defineEmits(["showQuestion"]);

function onShowQuestion() {
  const data = {
    ...props.question
  }
  emits("showQuestion", data);
}

function onHandle() {
  if (!props.markable) {
    return;
  }

  selected.value = !selected.value;
}


const starsLevels = computed(() => {
  const { level } = props.question;

  const total =
    level === "fácil"
      ? 1
      : level === "normal"
      ? 2
      : level === "difícil"
      ? 3
      : 0;

  return total;
});
</script>

<style scoped>
.card {
  max-height: 200px;
  cursor: pointer;
}
</style>
