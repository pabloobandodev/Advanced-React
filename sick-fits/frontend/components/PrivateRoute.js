import { useQuery } from '@apollo/react-hooks'
import { CURRENT_USER_QUERY } from '../lib/queries'
import SignIn from './SignIn'

export default function PrivateRoute({ children }) {
  const { data = { me: null }, loading } = useQuery(CURRENT_USER_QUERY)

  if (loading) {
    return <p>Loading...</p>
  }

  if (!data.me) {
    return (
      <div>
        <p>Please Sign In before Continuing</p>
        <SignIn />
      </div>
    )
  }

  return children
}
