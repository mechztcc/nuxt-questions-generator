<template>
  <div class="grid grid-cols-1 md:grid-cols-1">
    <div class="col-span-1">
      <div
        @drop="onDrop"
        @click="onClick"
        ref="dropZoneRef"
        class="flex flex-col items-center py-10 px-5 mx-5 md:mx-10 rounded-lg mt-10 bg-zinc-50"
      >
        <Icon name="solar:paperclip-rounded-broken" size="2em" class="" />

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
            <b>.PDF</b>
          </small>
          <small class="bg-purple-400 rounded-lg px-2 py-1 text-zinc-50 mx-2">
            <b>.TXT</b>
          </small>
        </div>
      </div>
    </div>

    <div class="col-span-1">
      <div
        class="flex flex-col items-center md:mx-10 rounded-lg bg-zinc-50 mt-5 w-fit px-3 py-3"
        v-if="file"
      >
        <div class="flex justify-end w-full mb-2">
          <Icon
            name="solar:trash-bin-minimalistic-2-bold"
            size="1em"
            class="bg-red-400 cursor-pointer"
            @click="onRemoveFile"
          />
        </div>

        <div class="flex items-center">
          <Icon
            name="solar:file-send-bold"
            size="1em"
            class="bg-purple-400 mx-3"
          />
          <span class="text-zinc-500">{{ file.name }}</span>
        </div>

        <div class="flex w-full mt-3">
          <button
            @click="execute()"
            class="bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg w-full h-full hover:from-purple-300 hover:to-purple-500 py-1 px-1 text-zinc-50"
          >
            <b>ENVIAR</b>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDropZone } from "@vueuse/core";

definePageMeta({
  layout: "with-sidebar",
});

const dropZoneRef = ref<HTMLDivElement>();
const inputFile = ref<HTMLDivElement>();

const file = ref();
const base64File = ref();

function onRemoveFile() {
  file.value = null;
}

function onClick() {
  inputFile.value?.click();
}

function onDrop(files: File[] | null) {
  file.value = files![0] ?? null;
  console.log(file.value);
}

function onInputFile(event: Event) {
  const files = event.target["files"];

  onDrop(Array.from(files ?? []));
}

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop,
  dataTypes: ["image/jpeg"],
  multiple: false,
  preventDefaultForUnhandled: false,
});

async function onPrepareBuffer() {
  const arrayBuffer = await file.value.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

  base64File.value = base64;
}

const body = computed(() => base64File.value);

const { data, pending, error, execute } = await useFetch(
  "http://localhost:3001/upload-file",
  { method: "post", body, immediate: false }
);
</script>

<style></style>
