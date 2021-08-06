import Model from './model'

export default class User extends Model {
  id?: string
  name?: string
  email?: string
  avatar?: string
  provider?: string
  permission?: string
  // if isAdmin then user is authenticated
  isAuthenticated?: boolean

  constructor({
    id = '',
    name = '',
    email = '',
    avatar = '',
    provider = '',
    permission = 'user',
    isAuthenticated = false,
  }: {
    id?: string
    name?: string
    email?: string
    provider?: string
    avatar?: string
    permission?: string
    isAuthenticated?: boolean
  }) {
    super(id)
    this.id = id
    this.name = name
    this.email = email
    this.avatar = avatar
    this.provider = provider
    this.permission = permission
    this.isAuthenticated = isAuthenticated
  }
  toJSON() {
    return { ...this }
  }
  static unAuthenticatedUser() {
    return new User({})
  }
  static fromJSON(adminUser: any) {
    return new User({
      id: adminUser.id,
      name: adminUser.name,
      email: adminUser.email,
      avatar: adminUser.avatar,
      permission: adminUser.permission,
      isAuthenticated: true,
    })
  }
}
