import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import CartStyles from './styles/CartStyles'
import Supreme from './styles/Supreme'
import CloseButton from './styles/CloseButton'
import SickButton from './styles/SickButton'

export const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client
  }
`

export const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`

export default function Cart() {
  const { data = { cartOpen: false } } = useQuery(LOCAL_STATE_QUERY)
  const [toggleCart] = useMutation(TOGGLE_CART_MUTATION)

  return (
    <CartStyles open={data.cartOpen}>
      <header>
        <CloseButton onClick={toggleCart}>&times;</CloseButton>
        <Supreme>Your Cart</Supreme>
        <p>You have __ Items in your cart.</p>
      </header>
      <footer>
        <p>$10.10</p>
        <SickButton>Checkout</SickButton>
      </footer>
    </CartStyles>
  )
}
