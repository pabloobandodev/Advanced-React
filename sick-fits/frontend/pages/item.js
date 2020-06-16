import SingleItem from '../components/SingleItem'

export default function Item(props) {
  return (
    <div>
      <SingleItem id={props.query.id} />
    </div>
  )
}
