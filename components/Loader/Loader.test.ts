import { mount } from '@vue/test-utils'
import Loader from './Loader.vue'

describe('Loader', () => {
  it('renderiza corretamente', () => {
    const wrapper = mount(Loader)
    expect(wrapper.exists()).toBe(true)
  })
})
