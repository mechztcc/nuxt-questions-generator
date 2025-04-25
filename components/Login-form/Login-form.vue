<template>
  <div class="flex flex-col justify-center px-10 lg:px-20 py-10 h-full">
    <div class="flex justify-center">
      <Icon name="solar:bolt-bold" size="4em" class="mx-3 mb-10" />
    </div>
    <h1 class="text-xl"><b>Bem-vindo</b></h1>
    <span class="text-md">
      Preencha o formulário abaixo para acessar o sistema
    </span>

    <div class="flex flex-col mt-5">
      <label for="email"><b>E-mail</b></label>
      <div
        :class="{
          'flex items-center border rounded-lg py-3 px-3 mt-2 bg-white': true,
          'border-red-200': errors.email,
        }"
      >
        <Icon
          name="solar:mailbox-bold"
          :class="{
            'mx-3': true,
            'text-red-300': errors.email,
            'text-purple-300': email,
          }"
        />
        <input type="text" class="w-full h-full outline-none" v-model="email" />
      </div>

      <p v-if="errors.email" class="text-red-400 text-sm mt-1">
        {{ errors.email }}
      </p>
    </div>

    <div class="flex flex-col mt-5">
      <label for="password"><b>Senha</b></label>
      <div
        :class="{
          'flex items-center border rounded-lg py-3 px-3 mt-2 bg-white': true,
          'border-red-200': errors.password,
        }"
      >
        <Icon
          name="solar:lock-password-bold"
          :class="{
            'mx-3': true,
            'text-red-300': errors.password,
            'text-purple-300': password,
          }"
        />
        <input
          type="password"
          class="w-full h-full outline-none"
          v-model="password"
        />
      </div>

      <p v-if="errors.password" class="text-red-400 text-sm mt-1">
        {{ errors.password }}
      </p>
    </div>

    <div class="flex justify-end mt-3">
      <span class="text-zinc-700">Esqueceu a senha?</span>
    </div>

    <div class="flex mt-10">
      <button
        @click="onSubmit()"
        class="bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg w-full h-full hover:from-purple-300 hover:to-purple-500 py-4 px-4 text-zinc-50"
      >
        <b>ENTRAR</b>
      </button>
    </div>

    <div class="flex justify-center mt-3">
      <nuxt-link to="/create-account">
        <span class="text-zinc-700 cursor-pointer"
          >Ainda não sou registrado</span
        >
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as yup from "yup";
import { useForm } from "vee-validate";
import { useLocalStorage } from "@vueuse/core";

const router = useRouter();

const schema = yup.object({
  email: yup
    .string()
    .email("E-mail inválido")
    .required("O e-mail é obrigatório"),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .required("A senha é obrigatória"),
});

const { defineField, handleSubmit, errors, resetForm } = useForm({
  validationSchema: schema,
});

const [email] = defineField("email");
const [password] = defineField("password");

const body = computed(() => {
  return {
    email: email.value,
    password: password.value,
  };
});

const { data, status, execute } = useFetch(
  "http://localhost:3000/users/create-session",
  {
    immediate: false,
    method: "post",
    body,
    watch: false,
  }
);

async function onSubmit() {
  await execute();

  if (data.value) {
    resetForm();
    const credentials = data.value;
    useLocalStorage("credentials", credentials);

    router.push("/");
  }
}
</script>

<style scoped></style>
