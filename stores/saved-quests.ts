import { defineStore } from 'pinia'
import type { IQuestion } from '~/interfaces/question.interface'

export const useSavedQuestsStore = defineStore('useSavedQuests', {
  state: () => ({ 
    quests: [] as IQuestion[]
  }),
  actions: {
    onUnmarkQuests() {
      this.quests.map(el => el.marked = false);
    }
  }
})
