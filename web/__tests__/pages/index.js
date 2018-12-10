import React from 'react'
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({ adapter: new Adapter() })
import Home from '../../pages/index.js'

describe('Home', () => {
  it('renders the page', () => {
    let rendered = shallow(<Home />)
    expect(rendered.html()).toContain('Hello World')
  })
})
