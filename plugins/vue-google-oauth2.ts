import Vue from 'vue'
import { LoaderPlugin } from 'vue-google-login'
import { client_id } from '~/lib/constants'

declare module 'vue/types/vue' {
  interface VueConstructor {
    GoogleAuth: gapi.auth2.GoogleAuth
  }
  interface Vue {
    google: gapi.auth2.GoogleAuth
    isMobile: boolean
  }
}

Vue.use(LoaderPlugin, { client_id, scope: 'email profile' })
Vue.prototype.google = Vue.GoogleAuth
declare type LoaderPlugin = {
  value: any
}
