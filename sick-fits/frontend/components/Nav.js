import Link from 'next/link'
import { useQuery } from '@apollo/react-hooks'
import NavStyles from './styles/NavStyles'
import { CURRENT_USER_QUERY } from '../lib/queries'
import SignOut from './SignOut'

export default function Nav() {
  const { data = { me: null }, loading, error } = useQuery(CURRENT_USER_QUERY)

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
