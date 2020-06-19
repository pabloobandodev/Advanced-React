import React from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import Form from './styles/Form'
import Error from './ErrorMessage'
import { CURRENT_USER_QUERY } from '../lib/queries'

const RESET_PASSWORD_MUTATION = gql`
  mutation RESET_PASSWORD_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      name
      email
    }
  }
`

export default function Reset({ resetToken }) {
  const [formData, setFormData] = React.useState({
    password: '',
    confirmPassword: '',
  })
  const [
    resetPassword,
    { error, loading },
  ] = useMutation(RESET_PASSWORD_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  })

  const saveToFormData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    await resetPassword({ variables: { ...formData, resetToken } })
    setFormData({ password: '', confirmPassword: '' })
  }

  return (
    <Form onSubmit={onSubmit}>
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>Reset your password</h2>
        <Error error={error} />
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
        <label htmlFor='confirmPassword'>
          Password
          <input
            type='password'
            name='confirmPassword'
            placeholder='confirmPassword'
            value={formData.confirmPassword}
            onChange={saveToFormData}
          />
        </label>
        <button type='submit'>Reset your password!</button>
      </fieldset>
    </Form>
  )
}
