import React from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import Form from './styles/Form'
import Error from './ErrorMessage'

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`

export default function Signup(props) {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
  })
  const [signup, { error, loading, data }] = useMutation(SIGNUP_MUTATION)

  const saveToFormData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    signup({ variables: formData })
  }

  return (
    <Form onSubmit={onSubmit}>
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>Sign up for An Account</h2>
        <Error error={error} />
        <label htmlFor='email'>
          Email
          <input
            type='email'
            name='email'
            placeholder='email'
            value={formData.email}
            onChange={saveToFormData}
          />
        </label>
        <label htmlFor='name'>
          Name
          <input
            type='text'
            name='name'
            placeholder='name'
            value={formData.name}
            onChange={saveToFormData}
          />
        </label>
        <label htmlFor='password'>
          Password
          <input
            type='password'
            name='password'
            placeholder='password'
            value={formData.password}
            onChange={saveToFormData}
          />
        </label>
        <button type='submit'>Sign Up!</button>
      </fieldset>
    </Form>
  )
}
