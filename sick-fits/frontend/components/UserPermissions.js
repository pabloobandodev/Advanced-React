import React from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import SickButton from './styles/SickButton'
import possiblePermissions from '../lib/possiblePermissions'

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation UPDATE_PERMISSIONS($permissions: [Permission], $userId: ID!) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`

export default function UserPermissions({ user }) {
  const [updatePermissions, { data, error, loading }] = useMutation(
    UPDATE_PERMISSIONS_MUTATION
  )
  const [permissions, setPermissions] = React.useState(user.permissions || [])

  const handlePermissionChange = (e) => {
    const checkbox = e.target
    let updatedPermissions = [...permissions]

    if (checkbox.checked) {
      updatedPermissions.push(checkbox.value)
    } else {
      updatedPermissions = updatedPermissions.filter(
        (permission) => permission !== checkbox.value
      )
    }

    setPermissions(updatedPermissions)
  }

  return (
    <>
      {error && (
        <tr>
          <td colSpan='8'>
            <Error error={error} />
          </td>
        </tr>
      )}
      <tr key={user.id}>
        <td>{user.name}</td>
        <td>{user.email}</td>
        {possiblePermissions.map((permission) => (
          <td key={permission}>
            <label htmlFor={`${user.id}-permission-${permission}`}>
              <input
                id={`${user.id}-permission-${permission}`}
                type='checkbox'
                checked={permissions.includes(permission)}
                value={permission}
                onChange={handlePermissionChange}
              />
            </label>
          </td>
        ))}
        <td>
          <SickButton
            type='button'
            disabled={loading}
            onClick={() =>
              updatePermissions({ variables: { permissions, userId: user.id } })
            }
          >
            Updat{loading ? 'ing' : 'e'}
          </SickButton>
        </td>
      </tr>
    </>
  )
}
