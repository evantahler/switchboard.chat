import React from 'react'
import { shallow } from 'enzyme'

import Home from '../../pages/index.js'

describe('Home', () => {
  it('renders the page', () => {
    let rendered = shallow(<Home />)
    expect(rendered.html()).toContain('Centralized SMS Communication for Teams')
  })
})
