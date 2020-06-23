import Link from 'next/link'
import { useQuery, useMutation } from '@apollo/react-hooks'
import NavStyles from './styles/NavStyles'
import SignOut from './SignOut'
import { CURRENT_USER_QUERY } from '../lib/queries'
import { TOGGLE_CART_MUTATION } from '../components/Cart'

export default function Nav() {
  const { data = { me: null }, loading, error } = useQuery(CURRENT_USER_QUERY)
  const [toggleCart] = useMutation(TOGGLE_CART_MUTATION)

  const manageOptions = () => {
    if (!data.me) {
      return (
        <Link href='/signup'>
          <a>Sign In</a>
        </Link>
      )
    }

    return (
      <>
        <Link href='/sell'>
          <a>Sell</a>
        </Link>
        <Link href='/orders'>
          <a>Orders</a>
        </Link>
        <Link href='/me'>
          <a>Account</a>
        </Link>
        <button onClick={toggleCart}>My Cart</button>
        <SignOut />
      </>
    )
  }

  return (
    <NavStyles>
      <Link href='/items'>
        <a>Shop</a>
      </Link>
      {manageOptions()}
    </NavStyles>
  )
}
