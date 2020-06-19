import React from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import Form from './styles/Form'
import Error from './ErrorMessage'

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`

export default function Signup(props) {
  const [formData, setFormData] = React.useState({ email: '' })
  const [requestReset, { error, loading, called }] = useMutation(
    REQUEST_RESET_MUTATION
  )

  const saveToFormData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    await requestReset({ variables: formData })
    setFormData({ email: '' })
  }

  return (
    <Form onSubmit={onSubmit}>
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>Request a password reset</h2>
        <Error error={error} />
        {!error && !loading && called && (
          <p>Success! Check your email for a reset link</p>
        )}
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
        <button type='submit'>Request Reset!</button>
      </fieldset>
    </Form>
  )
}
