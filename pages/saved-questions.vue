<template>
  <div class="grid grid-cols-3 px-5 md:px-10 gap-5">
    <div class="col-span-3">
      <div class="flex flex-col px-5 py-5 rounded-lg bg-zinc-50">
        <h1 class="text-2xl">Questões salvas</h1>
        <span class="text-zinc-700">
          Aqui você consegue visualizar todas questões salvas por você
        </span>
      </div>
    </div>

    <div class="col-span-2 col-start-2">
      <div class="flex justify-end w-full items-center">
        <div class="relative group" @click="onHandleMarkables()">
          <div
            :class="{
              'flex w-fit px-3 py-3 rounded-lg h-full hover:bg-zinc-800 hover:text-zinc-50': true,
              'bg-zinc-800': markables,
              'bg-zinc-50': !markables,
            }"
          >
            <Icon name="solar:printer-2-broken" :class="{ 'text-zinc-50': markables }" />
          </div>

          <span
            class="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
          >
            Salvar como .DOCX
          </span>
        </div>

        <div class="relative group">
          <div class="flex w-fit px-3 py-3 rounded-lg bg-zinc-50  hover:bg-zinc-800 hover:text-zinc-50 h-full mx-2">
            <Icon name="solar:filter-broken" class="" />
          </div>

          <span
            class="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
          >
            Filtrar
          </span>
        </div>

        <input
          type="text"
          class="outline-none py-3 px-3 rounded-lg bg-zinc-50"
          placeholder="Buscar"
        />
      </div>
    </div>

    <div class="col-span-3" v-if="markables">
      <div class="flex flex-col">
        <span class="text-zinc-800"><b>Selecione quais questões você deseja salvar</b></span>
        <span class="text-zinc-700 text-sm">03 questões selecionadas</span>

        <nuxt-link to="/activity-preview">
          <button class="bg-zinc-800 px-3 py-3 rounded-lg w-fit text-zinc-50 mt-3">Pré-visualização</button>
        </nuxt-link>
      </div>
    </div>

    <template v-if="showingQuestion">
      <div class="col-span-3">
        <QuestionVisualizer :question="showingQuestion" />
      </div>
    </template>

    <template v-if="data">
      <div class="col-span-1" v-for="(item, index) in store.quests" :key="index">
        <CardQuestion :question="item" :markable="markables" @show-question="onReceiveQuest"/>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useLocalStorage } from "@vueuse/core";
import type { IQuestion } from "~/interfaces/question.interface";
import { useSavedQuestsStore } from "~/stores/saved-quests";

definePageMeta({
  layout: "with-sidebar",
});

const store = useSavedQuestsStore()
const markables = ref<boolean>(false);
const showingQuestion = ref<IQuestion>()

function onReceiveQuest(quest: IQuestion) {
  showingQuestion.value = quest;
}

const storage = useLocalStorage("credentials", null);

const authorization = computed(() => {
  const data = JSON.parse(storage.value ?? "");
  return data.token;
});


const { data, status, execute } = useFetch<IQuestion[]>(
  "http://localhost:3000/users/list-questions",
  {
    method: "get",
    headers: {
      authorization: authorization.value,
    },
    immediate: false
  }
);

function onHandleMarkables() {
  markables.value = !markables.value;
  if(!markables.value) {
    store.onUnmarkQuests();
  }
}

onMounted(async () => {
  await execute()

  if(data.value) {
    store.quests = data.value;
  }
})
</script>

<style>
.group {
  cursor: pointer;
}
</style>
