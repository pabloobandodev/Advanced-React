const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const createItem = async (parent, args, ctx, info) => {
  // TODO: Check if they are logged in

  const item = await ctx.db.mutation.createItem(
    {
      data: {
        ...args,
      },
    },
    info
  )

  return item
}

const updateItem = async (parent, args, ctx, info) => {
  const updates = { ...args }
  delete updates.id
  const updatedItem = await ctx.db.mutation.updateItem(
    {
      data: updates,
      where: {
        id: args.id,
      },
    },
    info
  )

  return updatedItem
}

const deleteItem = async (parent, args, ctx, info) => {
  const where = { id: args.id }
  // 1. Find the item
  const item = await ctx.db.query.item({ where }, `{id title}`)
  // 2. Check if they own that item, on have the permissions
  // TODO
  // 3. Delete it!
  return ctx.db.mutation.deleteItem({ where }, info)
}

const signup = async (parent, args, ctx, info) => {
  args.email = args.email.toLowerCase()
  const password = await bcrypt.hash(args.password, 10)
  const user = await ctx.db.mutation.createUser(
    {
      data: {
        ...args,
        password,
        permissions: { set: ['USER'] },
      },
    },
    info
  )
  const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
  ctx.response.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  })
  return user
}

const Mutations = {
  createItem,
  updateItem,
  deleteItem,
  signup,
}

module.exports = Mutations
