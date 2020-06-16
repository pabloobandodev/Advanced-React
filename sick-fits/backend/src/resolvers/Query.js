const { forwardTo } = require('prisma-binding')

const items = forwardTo('db')
const item = forwardTo('db')
const itemsConnection = forwardTo('db')

const Query = {
  items,
  item,
  itemsConnection,
}

module.exports = Query
