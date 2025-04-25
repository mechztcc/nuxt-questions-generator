<template>
  <div class="flex flex-col">
    <div class="grid grid-cols-1 md:grid-cols-1">
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
    </div>

    <div class="grid grid-cols-3">
      <div class="col-span-1">
        <div
          class="flex flex-col items-center md:mx-10 rounded-lg bg-zinc-50 mt-5 w-fit px-3 py-3 w-full"
          v-if="file"
        >
          <div class="flex justify-end w-full mb-2">
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

          <div class="flex items-center w-full">
            <Icon
              name="solar:file-send-bold"
              size="1em"
              class="bg-purple-400 mx-3"
            />
            <span class="text-zinc-500 text-start">{{ file.name }}</span>
          </div>

          <div class="flex w-full mt-3">
            <button
              class="bg-zinc-800 hover:bg-zinc-900 rounded-lg w-full h-full py-1 px-1 text-zinc-50"
              @click="execute()"
            >
              <b v-if="status !== 'pending'">Enviar</b>

              <b v-if="status == 'pending'"> Enviando </b>
            </button>
          </div>
        </div>
      </div>

      <div class="col-span-3 mt-10" v-if="data">
        <QuestionVisualizer
          v-for="(item, index) in data.questions"
          :key="index"
          :question="item"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDropZone } from "@vueuse/core";
import mammoth from "mammoth";

definePageMeta({
  layout: "with-sidebar",
});

const dropZoneRef = ref<HTMLDivElement>();
const inputFile = ref<HTMLDivElement>();

const file = ref();
const fileContent = ref();

function onRemoveFile() {
  file.value = null;
}

function onClick() {
  inputFile.value?.click();
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
