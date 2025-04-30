<template>
  <div class="flex flex-col">
    <div class="grid grid-cols-3 mx-10">
      <div class="col-span-3">
        <div class="flex flex-col px-5 py-5 rounded-lg bg-zinc-50">
          <h1 class="text-2xl">Pré-visualização do documento</h1>
          <span class="text-zinc-700">
            Confira as questões selecionadas antes de gerar o arquivo final.
          </span>
        </div>
      </div>

      <div class="col-span-3">
        <div class="flex justify-end">
          <button
            class="bg-zinc-800 py-3 px-3 mt-3 rounded-lg text-zinc-50 mr-3"
            @click="exportAsPDF"
          >
            Imprimir PDF
          </button>

          <button
            class="bg-zinc-800 py-3 px-3 mt-3 rounded-lg text-zinc-50"
            @click="exportAsDOCX()"
          >
            Imprimir DOCX
          </button>
        </div>
      </div>
    </div>

    <div
      :class="{ 'grid grid-cols-3 mx-10': true, 'bg-white': printable }"
      id="printable"
    >
      <div
        class="col-span-3"
        v-for="(item, index) in store.quests"
        :key="index"
      >
        <QuestionVisualizer :question="item" :printable="printable" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useLoaderStore } from "~/stores/loader";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

definePageMeta({
  layout: "with-sidebar",
});

let html2pdf = null;

if (import.meta.client) {
  import("html2pdf.js").then((module) => {
    html2pdf = module.default;
  });
}

const printable = ref<boolean>(false);

const store = useSavedQuestsStore();
const loader = useLoaderStore();

async function exportAsPDF() {
  printable.value = true;
  loader.isLoading = true;

  const element = document.getElementById("printable");

  const options = {
    margin: 10,
    filename: "prova-final.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  await html2pdf().set(options).from(element).save();
  printable.value = false;
  loader.isLoading = false;
}

async function exportAsDOCX() {
  const selectedQuestions = store.quests.filter((el) => el.marked);

  const paragrafos = selectedQuestions.flatMap((q, i) => [
    
    new Paragraph({
      children: [
        new TextRun({
          text: `${i + 1}. ${q.title}`,
          bold: true,
          size: 24,
        }),
      ],
      spacing: { after: 300, before: 600 },
    }),
    ...q.answers.map(
      (opt, index) =>
        new Paragraph({
          children: [
            new TextRun({
              text: `${String.fromCharCode(65 + index)}. ${opt.value}`,
              size: 24
            }),
          ],
          spacing: { after: 50 },
        })
    ),
  ]);

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          ...paragrafos,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "prova-final.docx");
}
</script>

<style></style>
