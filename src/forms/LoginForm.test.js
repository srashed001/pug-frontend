import * as React from 'react'
import {render, screen, act} from '../test/test-utils'
import userEvent from '@testing-library/user-event'
import LoginForm from './LoginForm'



test('it renders without crashing', () => {
    const handleSubmit = jest.fn()
    render(<LoginForm login={handleSubmit} />)
})

test('it matches snapshot', () => {
    const handleSubmit = jest.fn()
    const {asFragment } = render(<LoginForm login={handleSubmit} />)
    expect(asFragment()).toMatchSnapshot()
 
})

test('it submits form data when filled out', async () => {

    const handleSubmit = jest.fn()
    // const {debug} = render(<LoginForm login={handleSubmit} />)
    const [usernameInput, passwordInput] = screen.getAllByDisplayValue("")
    const submitButton = screen.getByRole('button', {name: /login/i})


    
    const username = 'test1'
    const password = 'password1'
    
    await userEvent.type(usernameInput, username)
    await userEvent.type(passwordInput, password)
    
    // debug()
    await userEvent.click(submitButton)
  
    expect(handleSubmit).toHaveBeenCalledWith({
      username,
      password,
    })
    expect(handleSubmit).toHaveBeenCalledTimes(1)
})


