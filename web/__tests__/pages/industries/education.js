import React from 'react'
import { shallow } from 'enzyme'

import Education from '../../../pages/industries/education.js'

describe('Education', () => {
  it('renders the page', () => {
    const rendered = shallow(<Education />)
    expect(rendered.html()).toContain('Switchboard for Education')
  })
})
