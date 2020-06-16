/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import Signup from '../components/Signup'

export default function SignupPage(props) {
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        grid-gap: 20px;
      `}
    >
      <Signup />
      <Signup />
      <Signup />
    </div>
  )
}
