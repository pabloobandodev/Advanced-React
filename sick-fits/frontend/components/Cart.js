import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import CartStyles from './styles/CartStyles'
import Supreme from './styles/Supreme'
import CloseButton from './styles/CloseButton'
import SickButton from './styles/SickButton'
import { CURRENT_USER_QUERY } from '../lib/queries'
import CartItem from './CartItem'
import calcTotalPrice from '../lib/calcTotalPrice'
import formatMoney from '../lib/formatMoney'

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
  const { data: user = { me: null }, loading, error } = useQuery(
    CURRENT_USER_QUERY
  )
  const [toggleCart] = useMutation(TOGGLE_CART_MUTATION)

  if (!user.me) {
    return null
  }

  return (
    <CartStyles open={data.cartOpen}>
      <header>
        <CloseButton onClick={toggleCart}>&times;</CloseButton>
        <Supreme>{user.me.name}'s Cart</Supreme>
        <p>
          You have {user.me.cart.length} Item{user.me.cart.length > 1 && 's'} in
          your cart.
        </p>
      </header>
      <ul>
        {user.me.cart.map((cartItem) => (
          <CartItem key={cartItem.id} cartItem={cartItem} />
        ))}
      </ul>
      <footer>
        <p>{formatMoney(calcTotalPrice(user.me.cart))}</p>
        <SickButton>Checkout</SickButton>
      </footer>
    </CartStyles>
  )
}
