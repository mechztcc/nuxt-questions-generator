<template>
  <div :class="{ 'flex flex-col px-5 py-5 rounded-lg mt-10': true, 'bg-white': printable, 'bg-zinc-50': !printable }">
    <div class="flex items-end" v-if="correctAnswer && showCorrect">
      <div class="flex w-fit bg-green-300 text-zinc-50 px-1 py-1 rounded-lg">
        <Icon name="solar:cup-star-broken" size="1.5em" class="" />
      </div>
      <span class="text-md mx-2 text-green-400">Você acertou</span>
    </div>

    <div
      class="flex items-end"
      v-if="!correctAnswer && showCorrect && !printable"
    >
      <div class="flex w-fit bg-red-300 text-zinc-50 px-1 py-1 rounded-lg">
        <Icon name="solar:close-circle-broken" size="1.5em" class="" />
      </div>
      <span class="text-md mx-2 text-red-400">Você errou</span>
    </div>

    <div class="flex justify-end mb-5 header" v-if="!printable">
      <div class="relative group">
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

      <div class="relative group" @click="onSaveQuestion()">
        <div
          :class="{
            'flex items-center justify-center w-fit px-2 py-2 rounded-full hover:bg-purple-300 cursor-pointer  mx-1': true,
            'bg-purple-300': savedQuestion,
            'bg-zinc-100': !savedQuestion,
          }"
        >
          <Icon name="solar:bookmark-line-duotone" class="" />
        </div>

        <span
          class="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
        >
          Salvar pergunta
        </span>
      </div>

      <div class="relative group">
        <div
          @click="onHandleCorrect"
          :class="{
            'flex items-center justify-center w-fit px-2 py-2 rounded-full bg-zinc-100 hover:bg-purple-300 cursor-pointer': true,
            blinking: markedAsCorrect != undefined && !showCorrect,
          }"
        >
          <Icon name="solar:question-square-broken" class="" />
        </div>

        <span
          class="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
        >
          Verificar resposta
        </span>
      </div>
    </div>
    <h1 class="text-lg">{{ question.title }}</h1>

    <div class="flex flex-col mt-5">
      <div
        :class="{
          'flex items-center justify-between w-full rounded-lg px-4 py-2 cursor-pointer mt-1': true,
          'hover:bg-purple-100': !item.correct,
          'bg-green-100': showCorrect && item.correct,
        }"
        v-for="(item, index) in question.answers"
        :key="index"
      >
        <div class="flex items-center">
          <Icon
            name="solar:add-square-bold"
            class="mr-2 text-green-300"
            v-if="item.correct && showCorrect"
          />
          <Icon
            name="solar:close-circle-broken"
            class="mr-2 text-red-400"
            v-if="!item.correct && showCorrect"
          />
          <span
            :class="{
              'text-md': true,
              'line-through': markedAsWrong.includes(index),
            }"
          >
            <div class="text-zinc-800">
              {{ item.value }}
            </div>
          </span>
        </div>

        <div class="flex items-center">
          <template v-if="printable">
            <div
              class="flex items-center justify-center w-fit px-4 py-4 rounded-full border border-zinc-300 cursor-pointer mx-1"
            ></div>
          </template>

          <template v-if="!printable">
            <div
              @click="onMarkAsCorrect(index)"
              :class="{
                'flex items-center justify-center w-fit px-2 py-2 rounded-full hover:bg-green-300  cursor-pointer mx-1': true,
                'bg-green-300': markedAsCorrect == index,
                'bg-zinc-100 ': markedAsCorrect != index,
              }"
            >
              <Icon name="solar:check-circle-broken" class="" />
            </div>

            <div
              @click="onMarkAsWrong(index)"
              :class="{
                'flex items-center justify-center w-fit px-2 py-2 rounded-full  hover:bg-red-300 hover:text-zinc-50 cursor-pointer mx-1': true,
                'bg-red-300': markedAsWrong.includes(index),
                'bg-zinc-100': !markedAsWrong.includes(index),
              }"
            >
              <Icon name="solar:scissors-square-broken" class="" />
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLocalStorage } from "@vueuse/core";
import type { IQuestion } from "~/interfaces/question.interface";

const storage = useLocalStorage("credentials", null);

const authorization = computed(() => {
  const data = JSON.parse(storage.value ?? "");
  return data.token;
});

const props = defineProps<{
  question: IQuestion;
  printable?: boolean;
}>();

const showCorrect = ref<boolean>(false);
const markedAsWrong = ref<number[]>([]);
const markedAsCorrect = ref<number>();
const savedQuestion = ref<boolean>();

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

const correctAnswer = computed(() => {
  return (
    props.question.answers.findIndex((el) => el.correct) ==
    markedAsCorrect.value
  );
});

function onHandleCorrect() {
  showCorrect.value = !showCorrect.value;
}

function onMarkAsWrong(index: number) {
  if (markedAsWrong.value.includes(index)) {
    markedAsWrong.value = markedAsWrong.value.filter((el) => el != index);
    return;
  }

  markedAsWrong.value.push(index);
}

function onMarkAsCorrect(index: number) {
  if (markedAsCorrect.value == index) {
    markedAsCorrect.value = undefined;
    return;
  }

  markedAsCorrect.value = index;

  if (markedAsWrong.value.length == 3) {
    // onHandleCorrect();
  }
}

const body = computed(() => {
  return {
    ...props.question,
  };
});

const { execute, data } = useFetch(
  "http://localhost:3000/users/save-question",
  {
    immediate: false,
    method: "post",
    headers: {
      authorization: authorization.value,
    },
    body,
    watch: false,
  }
);

async function onSaveQuestion() {
  await execute();

  if (data.value) {
    savedQuestion.value = true;
  }
}
</script>

<style scoped>
@keyframes blinkGreen {
  0%,
  100% {
    background-color: #d1fae5; /* bg-green-100 */
  }
  50% {
    background-color: #86efac; /* bg-green-300 */
  }
}

.blinking {
  animation: blinkGreen 1s infinite;
}
</style>
