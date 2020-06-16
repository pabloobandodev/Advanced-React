/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Item from './Item'
import Pagination from './Pagination'
import { perPage } from '../config'

const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY($skip: Int = 0, $first: Int = ${perPage}) {
    items(first: $first, skip: $skip) {
      id
      title
      price
      description
      image
      largeImage
    }
  }
`

export default function Items({ page }) {
  const { data, error, loading } = useQuery(ALL_ITEMS_QUERY, {
    variables: {
      skip: page * perPage - perPage,
    },
  })

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error: {error.message}</p>
  }

  return (
    <div
      css={css`
        text-align: center;
      `}
    >
      <Pagination page={page} />
      <div
        css={css`
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-gap: 60px;
          max-width: ${(props) => props.theme.maxWidth};
          margin: 0 auto;
        `}
      >
        {data.items.map((item) => (
          <Item item={item} key={item.id} />
        ))}
      </div>
      <Pagination page={page} />
    </div>
  )
}

export { ALL_ITEMS_QUERY }
