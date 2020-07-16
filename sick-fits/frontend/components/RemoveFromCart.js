import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import styled from 'styled-components'
import { CURRENT_USER_QUERY } from '../lib/queries'

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${(props) => props.theme.red};
    cursor: pointer;
  }
`

const update = (cache, payload) => {
  const data = cache.readQuery({ query: CURRENT_USER_QUERY })
  const cartItemId = payload.data.removeFromCart.id
  data.me.cart = data.me.cart.filter((cartItem) => cartItem.id !== cartItemId)
  cache.writeQuery({ query: CURRENT_USER_QUERY })
}

export default function RemoveFormCart({ id }) {
  const [removeFromCart, { error }] = useMutation(REMOVE_FROM_CART_MUTATION, {
    variables: { id },
    update,
    optimisticResponse: {
      __typename: 'Mutation',
      removeFromCart: {
        __typename: 'CartItem',
        id,
      },
    },
  })

  if (error) {
    alert(error.message)
  }

  return (
    <BigButton title='Delete Item' onClick={removeFromCart}>
      &times;
    </BigButton>
  )
}
