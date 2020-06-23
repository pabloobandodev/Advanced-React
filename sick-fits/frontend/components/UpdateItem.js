import React from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Mutation, Query } from 'react-apollo'
import gql from 'graphql-tag'
import Router from 'next/router'
import Form from './styles/Form'
import formatMoney from '../lib/formatMoney'
import Error from './ErrorMessage'

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`

export const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`

export default function UpdateItem(props) {
  const [itemData, setItemData] = React.useState({})
  const { data, loading } = useQuery(SINGLE_ITEM_QUERY, {
    variables: { id: props.id },
  })
  const [updateItem, dataMutation] = useMutation(UPDATE_ITEM_MUTATION, {
    variables: itemData,
  })

  const changeItemValue = (newValues) =>
    setItemData({ ...itemData, ...newValues })

  const updateItemData = (e) => {
    const { name, type, value } = e.target
    const val = type === 'number' ? parseFloat(value) : value
    changeItemValue({ [name]: val })
  }

  const onSubmitItem = async (e) => {
    e.preventDefault()

    const res = await updateItem({
      variables: {
        id: props.id,
        ...itemData,
      },
    })
  }

  if (loading) {
    return <p>Loading...</p>
  }
  if (!data) {
    return <p>No Item Found for Id {props.id}</p>
  }

  return (
    <Form onSubmit={(e) => onSubmitItem(e)}>
      <Error error={dataMutation.error} />
      <fieldset
        disabled={dataMutation.loading}
        aria-busy={dataMutation.loading}
      >
        <label htmlFor='title'>
          Title
          <input
            type='text'
            id='title'
            name='title'
            placeholder='Title'
            required
            defaultValue={data.item.title}
            onChange={updateItemData}
          />
        </label>
        <label htmlFor='price'>
          Price
          <input
            type='number'
            id='price'
            name='price'
            placeholder='Price'
            required
            defaultValue={data.item.price}
            onChange={updateItemData}
          />
        </label>
        <label htmlFor='Description'>
          Description
          <textarea
            id='description'
            name='description'
            placeholder='Enter A Description'
            required
            defaultValue={data.item.description}
            onChange={updateItemData}
          />
        </label>
        <button type='submit'>
          Sav{dataMutation.loading ? 'ing' : 'e'} Changes
        </button>
      </fieldset>
    </Form>
  )
}
