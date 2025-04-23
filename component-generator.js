#!/usr/bin/env node

import { mkdirSync, existsSync, writeFileSync } from "fs";
import { join, basename, dirname } from "path";

// Captura os argumentos passados no comando
const args = process.argv.slice(2);
if (args.length < 1) {
  console.error("Uso: npm run make-component components/NomeDoComponente");
  process.exit(1);
}

// Função para deixar a primeira letra maiúscula
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Transforma o caminho recebido para ter os diretórios e o nome do componente com a primeira letra maiúscula
const componentPath = args[0].split("/").map(capitalize).join("/");

const fullPath = join("components", componentPath);
const componentName = basename(componentPath);
const componentDir = dirname(fullPath);

// Criar diretório se não existir
mkdirSync(fullPath, { recursive: true });

// Criar arquivo `.vue`
const vueContent = `
<template>
  <div>
    <span>  ${componentName} works  </span>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>
`;

const componentFile = join(fullPath, `${componentName}.vue`);
if (!existsSync(componentFile)) {
  writeFileSync(componentFile, vueContent);
  console.log(`✅ Componente criado: ${componentFile}`);
} else {
  console.log("⚠️ O componente já existe.");
}

// Criar arquivo de teste
const testContent = `import { mount } from '@vue/test-utils'
import ${componentName} from './${componentName}.vue'

describe('${componentName}', () => {
  it('renderiza corretamente', () => {
    const wrapper = mount(${componentName})
    expect(wrapper.exists()).toBe(true)
  })
})
`;

const testFile = join(fullPath, `${componentName}.test.ts`);
if (!existsSync(testFile)) {
  writeFileSync(testFile, testContent);
  console.log(`✅ Teste criado: ${testFile}`);
} else {
  console.log("⚠️ O teste já existe.");
}

const storyContent = ``;

const storyFile = join(fullPath, `${componentName}.stories.ts`);
if (!existsSync(storyFile)) {
  writeFileSync(storyFile, storyContent);
  console.log(`✅ Storybook criado: ${storyFile}`);
} else {
  console.log("⚠️ O teste já existe.");
}
