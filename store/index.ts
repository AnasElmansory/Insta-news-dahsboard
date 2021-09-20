import User from '~/lib/models/user'

import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'

@Module
export default class extends VuexModule {
  user: User = User.unAuthenticatedUser()
  GoogleAuthInstance?: gapi.auth2.GoogleAuth
  @Mutation
  setGoogleAuth(auth: gapi.auth2.GoogleAuth) {
    this.GoogleAuthInstance = auth
  }

  @Mutation
  signIn(user: User) {
    this.user = user
  }

  @Mutation
  signOut() {
    this.user = User.unAuthenticatedUser()
  }

  get GoogleAuth(): gapi.auth2.GoogleAuth | undefined {
    return this.GoogleAuthInstance ?? undefined
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
