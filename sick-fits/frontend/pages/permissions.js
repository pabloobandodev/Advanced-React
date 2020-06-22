import PrivateRoute from '../components/PrivateRoute'
import Permissions from '../components/Permissions'

export default function PermissionsPage(props) {
  return (
    <PrivateRoute>
      <Permissions />
    </PrivateRoute>
  )
}
