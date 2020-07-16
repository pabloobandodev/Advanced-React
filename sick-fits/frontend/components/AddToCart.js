import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { CURRENT_USER_QUERY } from '../lib/queries'

const ADD_TO_CART_MUTATION = gql`
  mutation addToCart($id: ID!) {
    addToCart(id: $id) {
      id
      quantity
    }
  }
`

export default function AddToCart({ id }) {
  const [addToCart, { loading }] = useMutation(ADD_TO_CART_MUTATION, {
    variables: { id },
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  })
  return (
    <button onClick={addToCart} disabled={loading}>
      Add{loading && 'ing'} to Cart 🛒
    </button>
  )
}
