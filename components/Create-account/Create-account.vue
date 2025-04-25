<template>
  <div class="flex flex-col justify-center px-10 py-10 h-full">
    <div class="flex justify-center">
      <Icon name="solar:bolt-bold" size="4em" class="mx-3 mb-10" />
    </div>
    <h1 class="text-xl"><b>Bem-vindo</b></h1>
    <span class="text-md">
      Preencha o formulário abaixo para criar sua conta
    </span>

    <div class="flex flex-col mt-5">
      <label for="email"><b>Nome</b></label>
      <div class="flex items-center border rounded-lg py-3 px-3 mt-2 bg-white">
        <Icon name="solar:user-bold" class="mx-3" />
        <input type="text" class="w-full h-full outline-none" v-model="name" />
      </div>
    </div>

    <div class="flex flex-col mt-5">
      <label for="email"><b>E-mail</b></label>
      <div class="flex items-center border rounded-lg py-3 px-3 mt-2 bg-white">
        <Icon name="solar:mailbox-bold" class="mx-3" />
        <input type="text" class="w-full h-full outline-none" v-model="email" />
      </div>
    </div>

    <div class="flex flex-col mt-5">
      <label for="email"><b>Senha</b></label>
      <div class="flex items-center border rounded-lg py-3 px-3 mt-2 bg-white">
        <Icon name="solar:lock-password-bold" class="mx-3" />
        <input
          type="password"
          placeholder="******"
          class="w-full h-full outline-none"
          v-model="password"
        />
      </div>
    </div>

    <div class="flex flex-col mt-5">
      <label for="email"><b>Confirmar senha</b></label>
      <div class="flex items-center border rounded-lg py-3 px-3 mt-2 bg-white">
        <Icon name="solar:lock-password-bold" class="mx-3" />
        <input
          type="password"
          placeholder="******"
          class="w-full h-full outline-none"
          v-model="confirmPass"
        />
      </div>
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
  name: yup.string().required("O e-mail é obrigatório"),
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
