import User from '~/lib/models/user'

import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'

@Module
export default class extends VuexModule {
  user: User = User.unAuthenticatedUser()

  @Mutation
  signIn(user: User) {
    this.user = user
  }

  @Mutation
  signOut() {
    this.user = User.unAuthenticatedUser()
  }

  get isAuthenticated() {
    return this.user.isAuthenticated || false
  }

  get userInfo() {
    return this.user
  }

  @Action
  async nuxtServerInit(ctx: any) {
    if (!ctx.route || !ctx.route.name) return
    try {
      return true
    } catch (err) {}
  }
}
