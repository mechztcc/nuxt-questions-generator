import { mount } from '@vue/test-utils'
import Card-question from './Card-question.vue'

describe('Card-question', () => {
  it('renderiza corretamente', () => {
    const wrapper = mount(Card-question)
    expect(wrapper.exists()).toBe(true)
  })
})
