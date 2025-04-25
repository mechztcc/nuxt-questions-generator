import { mount } from '@vue/test-utils'
import Question-visualizer from './Question-visualizer.vue'

describe('Question-visualizer', () => {
  it('renderiza corretamente', () => {
    const wrapper = mount(Question-visualizer)
    expect(wrapper.exists()).toBe(true)
  })
})
