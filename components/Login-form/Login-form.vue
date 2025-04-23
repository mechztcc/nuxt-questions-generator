<template>
  <div class="flex flex-col justify-center px-10 py-10 h-full">
    <div class="flex justify-center">
      <Icon name="solar:bolt-bold" size="4em" class="mx-3 mb-10" />
    </div>
    <h1 class="text-xl">Bem-vindo</h1>
    <span class="text-md">
      Preencha o formulário abaixo para acessar o sistema
    </span>

    <div class="flex flex-col mt-5">
      <label for="email"><b>E-mail</b></label>
      <div class="flex items-center border rounded-lg py-3 px-3 mt-2">
        <Icon name="solar:mailbox-bold" class="mx-3" />
        <input type="text" class="w-full h-full outline-none" />
      </div>
    </div>

    <div class="flex flex-col mt-5">
      <label for="email"><b>Senha</b></label>
      <div class="flex items-center border rounded-lg py-3 px-3 mt-2">
        <Icon name="solar:lock-password-bold" class="mx-3" />
        <input type="text" class="w-full h-full outline-none" />
      </div>
    </div>

    <div class="flex mt-10">
      <button
        class="bg-purple-400 rounded-lg w-full h-full hover:bg-purple-500 py-4 px-4 text-zinc-50"
      >
        <b>ENTRAR</b>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
