import React from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import Form from './styles/Form'
import Error from './ErrorMessage'
import { CURRENT_USER_QUERY } from '../lib/queries'

const SIGN_IN_MUTATION = gql`
  mutation SIGN_IN_MUTATION($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      id
      email
      name
    }
  }
`

const INITIAL_STATE = {
  email: '',
  password: '',
}

export default function SignIn(props) {
  const [formData, setFormData] = React.useState(INITIAL_STATE)
  const [signIn, { error, loading, data }] = useMutation(SIGN_IN_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  })

  const saveToFormData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    await signIn({ variables: formData })
    setFormData(INITIAL_STATE)
  }

  return (
    <Form onSubmit={onSubmit}>
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>Sign into your account</h2>
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
        <button type='submit'>Sign In!</button>
      </fieldset>
    </Form>
  )
}
