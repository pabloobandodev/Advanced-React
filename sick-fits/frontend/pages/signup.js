/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import SignUp from '../components/SignUp'
import SignIn from '../components/SignIn'
import RequestReset from '../components/RequestReset'

export default function SignupPage(props) {
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        grid-gap: 20px;
      `}
    >
      <SignUp />
      <SignIn />
      <RequestReset />
    </div>
  )
}
