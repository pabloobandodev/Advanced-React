import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Error from './ErrorMessage'
import Table from './styles/Table'
import UserPermissions from './UserPermissions'
import possiblePermissions from '../lib/possiblePermissions'

const ALL_USERS_QUERY = gql`
  query ALL_USERS_QUERY {
    users {
      id
      name
      email
      permissions
    }
  }
`

export default function Permissions(props) {
  const { data, loading, error } = useQuery(ALL_USERS_QUERY)

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <Error error={error} />
      <h2>Manage Permissions</h2>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            {possiblePermissions.map((permission) => (
              <th key={permission}>{permission}</th>
            ))}
            <th>👇</th>
          </tr>
        </thead>
        <tbody>
          {data.users.map((user) => (
            <UserPermissions key={user.id} user={user} />
          ))}
        </tbody>
      </Table>
    </div>
  )
}
