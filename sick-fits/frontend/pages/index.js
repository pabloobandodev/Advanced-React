import Items from '../components/Items'

export default function Home(props) {
  return (
    <div>
      <Items page={parseFloat(props.query.page) || 1} />
    </div>
  )
}
