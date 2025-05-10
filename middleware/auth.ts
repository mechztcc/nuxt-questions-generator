import { useLocalStorage } from "@vueuse/core";

export default defineNuxtRouteMiddleware((to, from) => {
  const storage = useLocalStorage("credentials", null);

  const parsed = storage.value ? JSON.parse(storage.value) : null;
  console.log(parsed);
  

  if (!parsed?.token) {
    return navigateTo("/login");
  }
});
