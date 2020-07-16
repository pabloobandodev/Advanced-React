const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { randomBytes } = require('crypto')
const { promisify } = require('util')
const { transport, makeANiceEmail } = require('../mail')
const { hasPermission } = require('../utils')

const createItem = async (parent, args, ctx, info) => {
  if (!ctx.request.userId) {
    throw new Error('You must be logged in to do that')
  }

  const item = await ctx.db.mutation.createItem(
    {
      data: {
        user: {
          connect: {
            id: ctx.request.userId,
          },
        },
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
  const item = await ctx.db.query.item(
    { where: { id: args.id } },
    `{
      id 
      title
      user { 
        id
      }
    }`
  )

  const ownsItem = item.user.id === ctx.request.userId
  const hasPermissions = ctx.request.user.permissions.some((permission) =>
    ['ADMIN', 'ITEMDELETE'].includes(permission)
  )

  if (!ownsItem && !hasPermissions) {
    throw new Error(`You don't have permission to do that!`)
  }

  return ctx.db.mutation.deleteItem({ where: { id: args.id } }, info)
}

const signUp = async (parent, args, ctx, info) => {
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

const signIn = async (parent, { email, password }, ctx, info) => {
  const user = await ctx.db.query.user({ where: { email } })
  if (!user) {
    throw new Error(`No such user found for email ${email}`)
  }
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }
  const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
  ctx.response.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  })
  return user
}

const signOut = (parent, args, ctx, info) => {
  ctx.response.clearCookie('token')
  return { message: 'Goodbye!' }
}

const requestReset = async (parent, args, ctx, info) => {
  const user = await ctx.db.query.user({ where: { email: args.email } })
  if (!user) {
    throw new Error(`No such user found for email ${args.email}`)
  }
  const randomBytesPromisify = promisify(randomBytes)
  const resetToken = (await randomBytesPromisify(20)).toString('hex')
  const resetTokenExpiry = Date.now() + 3600000
  const res = await ctx.db.mutation.updateUser({
    where: { email: args.email },
    data: { resetToken, resetTokenExpiry },
  })
  const mailRes = await transport.sendMail({
    from: 'pablo@pablo.com',
    to: user.email,
    subject: 'Your Password Reset Token',
    html: makeANiceEmail(`Your Password Reset Token is here!
    \n\n
    <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click Here to Reset</a>`),
  })
  return { message: 'Thanks!' }
}

const resetPassword = async (
  parent,
  { password, confirmPassword, resetToken },
  ctx,
  info
) => {
  if (password !== confirmPassword) {
    throw new Error(`Your passwords don't match!`)
  }

  const [user] = await ctx.db.query.users({
    where: {
      resetToken: resetToken,
      resetTokenExpiry_gte: Date.now - 3600000,
    },
  })

  if (!user) {
    throw new Error('This token is either invalid or expired!')
  }

  const encryptedPassword = await bcrypt.hash(password, 10)

  const updatedUser = await ctx.db.mutation.updateUser({
    where: { email: user.email },
    data: {
      password: encryptedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  })

  const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET)
  ctx.response.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 36,
  })

  return updatedUser
}

const updatePermissions = async (parent, args, ctx, info) => {
  if (!ctx.request.userId) {
    throw new Error('You must be logged in')
  }

  const currentUser = await ctx.db.query.user(
    {
      where: {
        id: ctx.request.userId,
      },
    },
    info
  )

  hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE'])

  return ctx.db.mutation.updateUser(
    {
      data: {
        permissions: {
          set: args.permissions,
        },
      },
      where: {
        id: args.userId,
      },
    },
    info
  )
}

const addToCart = async (parent, args, ctx, info) => {
  const { userId } = ctx.request

  if (!userId) {
    throw new Error('You must be signed in sooon')
  }

  const [existingCartItem] = await ctx.db.query.cartItems(
    {
      where: {
        user: { id: userId },
        item: { id: args.id },
      },
    },
    info
  )

  if (existingCartItem) {
    return ctx.db.mutation.updateCartItem({
      where: { id: existingCartItem.id },
      data: { quantity: existingCartItem.quantity + 1 },
    })
  }

  return ctx.db.mutation.createCartItem(
    {
      data: {
        user: {
          connect: { id: userId },
        },
        item: {
          connect: { id: args.id },
        },
      },
    },
    info
  )
}

const removeFromCart = async (parent, args, ctx, info) => {
  const cartItem = await ctx.db.query.cartItem(
    {
      where: {
        id: args.id,
      },
    },
    `{ id, user { id } }`
  )
  if (!cartItem) {
    throw new Error('No CartItem Found!')
  }
  if (cartItem.user.id !== ctx.request.userId) {
    throw new Error('Cheating huhhhh')
  }
  return ctx.db.mutation.deleteCartItem(
    {
      where: { id: args.id },
    },
    info
  )
}

const Mutations = {
  createItem,
  updateItem,
  deleteItem,
  signUp,
  signIn,
  signOut,
  requestReset,
  resetPassword,
  updatePermissions,
  addToCart,
  removeFromCart,
}

module.exports = Mutations
