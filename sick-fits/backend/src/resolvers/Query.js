const { forwardTo } = require('prisma-binding')
const { hasPermission } = require('../utils')

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

const users = async (parent, args, ctx, info) => {
  if (!ctx.request.userId) {
    throw new Error('You must be logged in!')
  }

  hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE'])

  return ctx.db.query.users({}, info)
}

const Query = {
  items,
  item,
  itemsConnection,
  me,
  users,
}

module.exports = Query
