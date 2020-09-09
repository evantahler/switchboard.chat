import React from 'react'
import { shallow } from 'enzyme'

import Home from '../../pages/index.js'

describe('Home', () => {
  it('renders the page', () => {
    const rendered = shallow(<Home />)
    expect(rendered.html()).toContain('Centralized Text Messages for Teams')
  })
})
