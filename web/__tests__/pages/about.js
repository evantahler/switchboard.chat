import React from 'react'
import { shallow } from 'enzyme'

import About from '../../pages/about.js'

describe('About', () => {
  it('renders the page', () => {
    const rendered = shallow(<About />)
    expect(rendered.html()).toContain('About')
  })
})
