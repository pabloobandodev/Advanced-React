import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { CURRENT_USER_QUERY } from '../lib/queries'

const SIGN_OUT_MUTATION = gql`
  mutation SIGN_OUT_MUTATION {
    signOut {
      message
    }
  }
`

export default function SignOut(props) {
  const [signOut] = useMutation(SIGN_OUT_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  })

  return <button onClick={signOut}>Sign Out</button>
}
