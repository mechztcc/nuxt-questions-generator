import { mount } from '@vue/test-utils'
import Sidebar from './Sidebar.vue'

describe('Sidebar', () => {
  it('renderiza corretamente', () => {
    const wrapper = mount(Sidebar)
    expect(wrapper.exists()).toBe(true)
  })
})
