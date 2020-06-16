/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import Head from 'next/head'
import Error from './ErrorMessage'

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      largeImage
    }
  }
`

export default function SingleItem({ id }) {
  const { loading, error, data } = useQuery(SINGLE_ITEM_QUERY, {
    variables: { id },
  })

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <Error error={error} />
  }

  if (!data) {
    return <p>Can't found the data</p>
  }

  return (
    <div
      css={css`
        max-width: 1200px;
        margin: 2rem auto;
        box-shadow: ${(props) => props.theme.bs};
        display: grid;
        grid-auto-columns: 1fr;
        grid-auto-flow: column;
        min-height: 800px;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .details {
          margin: 3rem;
          font-size: 2rem;
        }
      `}
    >
      <Head>
        <title>Sick Fits | {data.item.title}</title>
      </Head>
      <img src={data.item.largeImage} alt={data.item.title} />
      <div className='details'>
        <h2>Viewing {data.item.title}</h2>
        <p>{data.item.description}</p>
      </div>
    </div>
  )
}
