import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import Head from 'next/head'
import Link from 'next/link'
import PaginationStyles from './styles/PaginationStyles'
import { perPage } from '../config'

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`

export default function Pagination({ page }) {
  const { data, loading } = useQuery(PAGINATION_QUERY)
  const count = data ? data.itemsConnection.aggregate.count : 0
  const pages = Math.ceil(count / perPage)

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <PaginationStyles>
      <Head>
        <title>
          Sick Fits! - Page {page} of {pages}
        </title>
      </Head>
      <Link
        prefetch
        href={{
          pathname: 'items',
          query: { page: page - 1 },
        }}
      >
        <a className='prev' aria-disabled={page <= 1}>
          Prev
        </a>
      </Link>
      <p>
        Page {page} of {pages}!
      </p>
      <p>{count} Items Total</p>
      <Link
        prefetch
        href={{
          pathname: 'items',
          query: { page: page + 1 },
        }}
      >
        <a className='prev' aria-disabled={page >= pages}>
          Next
        </a>
      </Link>
    </PaginationStyles>
  )
}
