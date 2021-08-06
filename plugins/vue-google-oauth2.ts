import Vue from 'vue'
import { LoaderPlugin } from 'vue-google-login'
import { client_id } from '~/lib/constants'

declare module 'vue/types/vue' {
  interface VueConstructor {
    GoogleAuth: Promise<gAuth>
  }
}

Vue.use(LoaderPlugin, { client_id })
declare type LoaderPlugin = {
  value: any
}

declare interface gAuth {
  signIn: any
  signOut: any
  isSignedIn: any
  currentUser: any
  grantOfflineAccess: any
}
