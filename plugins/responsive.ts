import { Context } from '@nuxt/types'
import Vue from 'vue'

export default function (context: Context) {
  let isMobile: boolean = false

  isMobile = /mobile/i.test(navigator.userAgent)

  context.payload = { layout: isMobile ? 'mobile' : 'dash' }
  console.log(context.payload)
  Vue.prototype.isMobile = isMobile
}
