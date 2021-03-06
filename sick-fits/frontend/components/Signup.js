import React from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import Form from './styles/Form'
import Error from './ErrorMessage'
import { CURRENT_USER_QUERY } from '../lib/queries'

const SIGN_UP_MUTATION = gql`
  mutation SIGN_UP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    signUp(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`

const INITIAL_STATE = {
  name: '',
  email: '',
  password: '',
}

export default function SignUp(props) {
  const [formData, setFormData] = React.useState(INITIAL_STATE)
  const [signUp, { error, loading, data }] = useMutation(SIGN_UP_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  })

  const saveToFormData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    await signUp({ variables: formData })
    setFormData(INITIAL_STATE)
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
