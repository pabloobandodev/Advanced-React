const { forwardTo } = require('prisma-binding')

const items = forwardTo('db')
const item = forwardTo('db')
const itemsConnection = forwardTo('db')
const me = (parent, args, ctx, info) => {
  if (!ctx.request.userId) {
    return null
  }
  return ctx.db.query.user(
    {
      where: { id: ctx.request.userId },
    },
    info
  )
}

const Query = {
  items,
  item,
  itemsConnection,
  me,
}

module.exports = Query
