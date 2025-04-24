import { mount } from '@vue/test-utils'
import Create-account from './Create-account.vue'

describe('Create-account', () => {
  it('renderiza corretamente', () => {
    const wrapper = mount(Create-account)
    expect(wrapper.exists()).toBe(true)
  })
})
