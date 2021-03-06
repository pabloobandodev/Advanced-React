/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import Link from 'next/link'
import Router from 'next/router'
import NProgress from 'nprogress'
import Nav from './Nav'
import Cart from './Cart'
import Search from './Search'

Router.onRouteChangeStart = () => NProgress.start()

Router.onRouteChangeComplete = () => NProgress.done()

Router.onRouteChangeError = () => NProgress.done()

export default function Header() {
  return (
    <header
      css={css`
        .bar {
          border-bottom: 10px solid ${(props) => props.theme.black};
          display: grid;
          grid-template-columns: auto 1fr;
          justify-content: stretch;
          align-items: stretch;
          @media (max-width: 1300px) {
            grid-template-columns: 1fr;
            justify-content: center;
          }
        }

        .sub-bar {
          display: grid;
          grid-template-columns: 1fr auto;
          border-bottom: 1px solid ${(props) => props.theme.lightgrey};
        }
      `}
    >
      <div className='bar'>
        <h1
          css={css`
            font-size: 4rem;
            margin-left: 2rem;
            position: relative;
            z-index: 2;
            transform: skew(-7deg);
            a {
              padding: 0.5rem 1rem;
              background: ${(props) => props.theme.red};
              color: white;
              text-transform: uppercase;
              text-decoration: none;
            }
            @media (max-width: 1300px) {
              margin: 0;
              text-align: center;
            }
          `}
        >
          <Link href='/'>
            <a>Sick Fits</a>
          </Link>
        </h1>
        <Nav />
      </div>
      <div className='sub-bar'>
        <Search />
      </div>
      <Cart />
    </header>
  )
}
