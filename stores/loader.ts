import { defineStore } from "pinia";

export const useLoaderStore = defineStore("useLoader", {
  state: () => ({
    isLoading: false as boolean,
  }),
  actions: {},
});
