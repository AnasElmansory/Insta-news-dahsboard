import { Inject } from '@nuxt/types/app'
import { Context } from '@nuxt/types'
import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    facebook: fb.FacebookStatic
  }
}

export default function (context: Context, inject: Inject) {
  const promise = new Promise((resolve, reject) => {
    FB.init({
      appId: '371234107550950',
      cookie: true,
      xfbml: true,
      version: 'v11.0',
    })
    if (FB !== undefined) {
      inject('facebook', FB)
      resolve(FB)
    } else {
      reject('facebook not initialzed!')
    }
  })
  promise.then((fb) => {
    Vue.prototype.facebook = fb
  })
}
