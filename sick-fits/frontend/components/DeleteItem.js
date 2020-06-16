import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { ALL_ITEMS_QUERY } from './Items'

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`

const update = (cache, payload) => {
  const data = cache.readQuery({ query: ALL_ITEMS_QUERY })
  data.items = data.items.filter(
    (item) => item.id !== payload.data.deleteItem.id
  )
  cache.writeQuery({ query: ALL_ITEMS_QUERY, data })
}

export default function DeleteItem({ children, id }) {
  const [deleteItem] = useMutation(DELETE_ITEM_MUTATION, {
    update,
    variables: { id },
  })

  const onClick = () => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteItem()
    }
  }

  return <button onClick={onClick}>{children}</button>
}
