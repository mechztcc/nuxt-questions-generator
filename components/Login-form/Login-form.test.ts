import { mount } from '@vue/test-utils'
import Login-form from './Login-form.vue'

describe('Login-form', () => {
  it('renderiza corretamente', () => {
    const wrapper = mount(Login-form)
    expect(wrapper.exists()).toBe(true)
  })
})
