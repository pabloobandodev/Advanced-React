import { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Router from 'next/router'
import Form from './styles/Form'
import Error from './ErrorMessage'

export const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`

export default function CreateItem() {
  const [itemData, setItemData] = useState({
    title: 'Cool Shoes',
    description: 'I love those Context',
    image: '',
    largeImage: '',
    price: 1000,
  })
  const [
    createItem,
    { loading, error, data },
  ] = useMutation(CREATE_ITEM_MUTATION, { variables: itemData })

  const changeItemValue = (newValues) =>
    setItemData({ ...itemData, ...newValues })

  const updateItemData = (e) => {
    const { name, type, value } = e.target
    const val = type === 'number' ? parseFloat(value) : value
    changeItemValue({ [name]: val })
  }

  const onSubmitItem = async (e) => {
    e.preventDefault()
    const res = await createItem()
    Router.push({
      pathname: '/item',
      query: { id: res.data.createItem.id },
    })
  }

  const uploadFile = async (e) => {
    const files = e.target.files
    const data = new FormData()
    data.append('file', files[0])
    data.append('upload_preset', 'sickfits')

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/dcboyc8ye/image/upload',
      {
        method: 'POST',
        body: data,
      }
    )
    const file = await res.json()
    changeItemValue({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url,
    })
  }

  return (
    <Form onSubmit={onSubmitItem}>
      <Error error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor='file'>
          Image
          <input
            type='file'
            id='file'
            name='file'
            placeholder='Upload An Image'
            required
            onChange={uploadFile}
          />
          {itemData.image && (
            <img width='200' src={itemData.image} alt='Upload Preview' />
          )}
        </label>

        <label htmlFor='title'>
          Title
          <input
            type='text'
            id='title'
            name='title'
            placeholder='Title'
            required
            value={itemData.title}
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
            value={itemData.price}
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
            value={itemData.description}
            onChange={updateItemData}
          />
        </label>
        <button type='submit'>Submit</button>
      </fieldset>
    </Form>
  )
}
