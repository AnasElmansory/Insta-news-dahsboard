import { Context } from '@nuxt/types'

export default function (context: Context) {
  context.$axios.onError((error) => {
    alert(
      `${error.response?.statusText}  StatusCode: ${error.response?.status}`
    )
  })
}
