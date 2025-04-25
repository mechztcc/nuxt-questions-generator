<template>
  <div class="flex flex-col justify-center px-10 lg:px-20 py-10 h-full w-full">
    <div class="flex justify-center">
      <Icon name="solar:bolt-bold" size="4em" class="mx-3 mb-10" />
    </div>
    <h1 class="text-xl"><b>Bem-vindo</b></h1>
    <span class="text-md">
      Preencha o formulário abaixo para criar sua conta
    </span>

    <div class="flex flex-col mt-5">
      <label for="email"><b>Nome</b></label>
      <div
        :class="{
          'flex items-center border rounded-lg py-3 px-3 mt-2 bg-white': true,
          'border-red-200': errors.name,
        }"
      >
        <Icon
          name="solar:user-bold"
          :class="{
            'mx-3': true,
            'text-red-300': errors.name,
            'text-purple-300': name,
          }"
        />
        <input type="text" class="w-full h-full outline-none" v-model="name" />
      </div>
      <p v-if="errors.name" class="text-red-400 text-sm mt-1">
        {{ errors.name }}
      </p>
    </div>

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
      <label for="email"><b>Senha</b></label>
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
          placeholder="******"
          class="w-full h-full outline-none"
          v-model="password"
        />
      </div>
      <p v-if="errors.password" class="text-red-400 text-sm mt-1">
        {{ errors.password }}
      </p>
    </div>

    <div class="flex flex-col mt-5">
      <label for="email"><b>Confirmar senha</b></label>
      <div
        :class="{
          'flex items-center border rounded-lg py-3 px-3 mt-2 bg-white': true,
          'border-red-200': errors.confirmPass,
        }"
      >
        <Icon
          name="solar:lock-password-bold"
          :class="{
            'mx-3': true,
            'text-red-300': errors.confirmPass,
            'text-purple-300': confirmPass,
          }"
        />
        <input
          type="password"
          placeholder="******"
          class="w-full h-full outline-none"
          v-model="confirmPass"
        />
      </div>
      <p v-if="errors.confirmPass" class="text-red-400 text-sm mt-1">
        {{ errors.confirmPass }}
      </p>
    </div>

    <div class="flex justify-end mt-3">
      <span class="text-zinc-700">Esqueceu a senha?</span>
    </div>

    <div class="flex mt-10">
      <button
        @click="onSubmit()"
        class=" rounded-lg w-full h-full bg-zinc-800 hover:bg-zinc-900 py-4 px-4 text-zinc-50"
      >
        <b>ENTRAR</b>
      </button>
    </div>

    <div class="flex justify-center mt-3">
      <nuxt-link to="/login">
        <span class="text-zinc-700 cursor-pointer">Ja sou cadastrado</span>
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as yup from "yup";
import { useForm } from "vee-validate";

const router = useRouter();

const schema = yup.object({
  name: yup.string().required("O nome é obrigatório"),
  email: yup
    .string()
    .email("E-mail inválido")
    .required("O e-mail é obrigatório"),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .required("A senha é obrigatória"),
  confirmPass: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .required("A senha é obrigatória"),
});

const { defineField, handleSubmit, errors, resetForm } = useForm({
  validationSchema: schema,
});

const [name] = defineField("name");
const [email] = defineField("email");
const [password] = defineField("password");
const [confirmPass] = defineField("confirmPass");

const body = computed(() => {
  return {
    name: name.value,
    email: email.value,
    password: password.value,
  };
});

const { data, status, execute } = useFetch("http://localhost:3000/users", {
  immediate: false,
  method: "post",
  body,
  watch: false,
});

async function onSubmit() {
  await execute();

  if (data.value) {
    resetForm();
    router.push("/login");
  }
}
</script>

<style scoped></style>
