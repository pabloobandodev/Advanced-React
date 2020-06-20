import CreateItem from '../components/CreateItem'
import PrivateRoute from '../components/PrivateRoute'

export default function Sell(props) {
  return (
    <PrivateRoute>
      <CreateItem />
    </PrivateRoute>
  )
}
