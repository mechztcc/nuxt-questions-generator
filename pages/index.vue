<template>
  <div class="flex flex-col">
    <div class="grid grid-cols-1 md:grid-cols-1">
      <div class="col-span-1">
        <div class="flex flex-col px-5 py-5 rounded-lg bg-zinc-50 mx-10">
          <h1 class="text-2xl">Gerador de questões</h1>
          <span class="text-zinc-700">
            Aqui você consegue gerar questões usando diferentes tipos de IA
          </span>
        </div>
      </div>

      <div class="col-span-1 cursor-pointer">
        <div
          @drop="onDrop"
          @click="onClick"
          ref="dropZoneRef"
          class="flex flex-col items-center py-10 px-5 mx-5 md:mx-10 rounded-lg mt-10 bg-zinc-50"
        >
          <Icon name="solar:document-broken" size="2.5em" class="" />

          <input
            type="file"
            class="hidden"
            ref="inputFile"
            @change="onInputFile($event)"
          />

          <h1 class="text-lg mt-3">
            Arraste ou clique para fazer o upload do arquivo
          </h1>
          <span class="text-zinc-700">Formatos aceitos:</span>
          <div class="flex">
            <small class="bg-purple-400 rounded-lg px-2 py-1 text-zinc-50">
              <b>.DOCX</b>
            </small>
          </div>
        </div>
      </div>

      <div class="col-span-1 mx-10 mt-10">
        <div
          class="flex items-center rounded-lg bg-zinc-50 px-3 py-3 w-full"
          v-if="file"
        >
          <div class="flex items-center w-full">
            <Icon
              name="solar:file-send-bold"
              size="2em"
              class="bg-purple-400 mx-3"
            />
            <span class="text-zinc-500 text-start">{{ file.name }}</span>

            <div class="flex justify-end w-full">
              <div
                class="flex w-fit px-1 py-1 rounded-lg bg-red-200 relative group cursor-pointer"
              >
                <Icon
                  name="solar:trash-bin-minimalistic-2-bold"
                  size="1em"
                  class="bg-red-400 cursor-pointer"
                  @click="onRemoveFile"
                />

                <span
                  class="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
                >
                  Remover arquivo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="grid grid-cols-5 mx-10 mt-10 px-7 py-7 gap-5 rounded-lg bg-zinc-50"
    >
      <div class="col-span-4">
        <div class="flex flex-col">
          <h1 class="text-lg"><b>Detalhes</b></h1>
          <span class="text-md text-zinc-700 mb-5"
            >Preencha o formulário abaixo com as especificações
          </span>
        </div>
      </div>

      <div class="col-span-1">
        <div class="flex justify-end">
          <Icon
            @click="onHandleDetails()"
            name="solar:square-alt-arrow-down-broken"
            class="cursor-pointer"
          />
        </div>
      </div>

      <template v-if="showDetails">
        <div class="col-span-5 flex flex-wrap">
          <div class="flex flex-col mr-3">
            <h5 class="text-md"><b>Tipo da resposta</b></h5>
              <select class="outline-none py-2 px-2 rounded-lg bg-white mt-2" v-model="questionsType" >
                <option value="closed">Fechada</option>
                <option value="opened">Abertas</option>
              </select>
          </div>

          <div class="flex flex-col mr-3">
            <h5 class="text-md"><b>Qtd de questões</b></h5>
            <input type="number" min="1" class="py-2 px-2 mt-2 outline-none" v-model="questionsCount" />
          </div>

          <div class="flex flex-col mr-3" v-if="questionsType == 'closed'">
            <h5 class="text-md"><b>Qtd de alternativas</b></h5>
            <input type="number" min="2" class="py-2 px-2 mt-2 outline-none" v-model="alternatives" />
          </div>

          <div class="flex flex-col mr-3">
            <h5 class="text-md"><b>Modelo de IA</b></h5>
            <select class="outline-none py-2 px-2 rounded-lg bg-white mt-2" v-model="IAmodel">
              <option value="Llama-4-Maverick">Llama-4-Maverick</option>
              <option value="Qwen3">Qwen3</option>
            </select>
          </div>

          

        </div>
      </template>
    </div>

    <div class="grid grid-cols-1">
      <div class="col-span-1 mx-10 mt-10" v-if="data">
        <QuestionVisualizer
          v-for="(item, index) in data.questions"
          :key="index"
          :question="item"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 mx-10 mt-10">
      <div class="grid grid-cols-3 mt-5">
        <div class="col-span-1 col-start-3">
          <button
            class="bg-zinc-800 hover:bg-zinc-900 rounded-lg w-full h-full py-3 px-2 text-zinc-50"
            @click="execute()"
          >
            <b v-if="status !== 'pending'">Enviar</b>

            <b v-if="status == 'pending'"> Enviando </b>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDropZone } from "@vueuse/core";
import mammoth from "mammoth";

definePageMeta({
  layout: "with-sidebar",
  middleware: ['auth']
});

const dropZoneRef = ref<HTMLDivElement>();
const inputFile = ref<HTMLDivElement>();

const file = ref();
const fileContent = ref();
const showDetails = ref();

const alternatives = defineModel('alternatives', { default: 4 })
const questionsCount = defineModel('questionsCount',{ default: 1 })
const IAmodel = defineModel('IAmodel',{ default: 'Qwen3' })
const questionsType = defineModel<'closed' | 'opened'>('questionsType', { default: 'closed' })

function onRemoveFile() {
  file.value = null;
}

function onClick() {
  inputFile.value?.click();
}

function onHandleDetails() {
  showDetails.value = !showDetails.value;
}

function onDrop(files: File[] | null) {
  file.value = files![0] ?? null;
  onPrepareBuffer();
}

function onInputFile(event: Event) {
  const files = event.target["files"];

  onDrop(Array.from(files ?? []));
}

useDropZone(dropZoneRef, {
  onDrop,
  dataTypes: [],
  multiple: false,
  preventDefaultForUnhandled: false,
});

async function onPrepareBuffer() {
  fileContent.value = null;
  fileContent.value = await extractTextFromDocx(file.value);
}

async function extractTextFromDocx(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });

  return result.value;
}

const body = computed(() => {
  return {
    content: fileContent.value,
    type: questionsType.value,
    alternatives: questionsType.value == 'closed' ? alternatives.value : 0,
    questionsCount: questionsCount.value,
    model: IAmodel.value
  };
});

const { execute, data, status } = useFetch(
  "http://localhost:3000/users/upload-file",
  {
    immediate: false,
    method: "post",
    body,
    watch: false,
  }
);
</script>

<style></style>
