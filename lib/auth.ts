import { NuxtOptionsRouter } from '@nuxt/types/config/router'
import { NuxtAxiosInstance } from '@nuxtjs/axios/types/index'
import { baseUrl } from './constants'
import User from './models/user'

export default async function getAdminUser(
  id: string,
  access_token: string,
  axios: any
): Promise<false | User> {
  try {
    const response = await axios.get(baseUrl + `/api/admins/${id}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        provider: 'google',
      },
    })

    if (response.data) {
      const user = User.fromJSON(response.data)

      return user
    } else {
      return false
    }
  } catch (eror: any) {
    console.error(eror.response.data)
    return false
  }
}

function avoidRedunduntRouting(
  router: any,
  to: string,
  replace: boolean = true
) {
  if (router.currentRoute.path !== to) {
    if (replace) {
      router.replace(to)
    } else {
      router.push(to)
    }
  }
}
async function checkUserOnInit(
  googleAuth: gapi.auth2.GoogleAuth,
  router: any,
  axios: NuxtAxiosInstance,
  to: string
) {
  if (googleAuth.isSignedIn.get()) {
    const googleUser = googleAuth.currentUser.get()
    const adminOr = await getAdminUser(
      googleUser.getId(),
      googleUser.getAuthResponse().access_token,
      axios
    )
    if (adminOr !== false) {
      avoidRedunduntRouting(router, to)
    } else {
      avoidRedunduntRouting(router, '/sign')
    }
  } else {
    avoidRedunduntRouting(router, '/sign')
  }
}

async function constructHeaders(googleAuth: gapi.auth2.GoogleAuth) {
  if (await googleAuth.isSignedIn.get()) {
    const googleUser = googleAuth.currentUser.get()
    return {
      Authorization: 'Bearer ' + googleUser.getAuthResponse().access_token,
      provider: 'google',
    }
  } else {
    return {
      Authorization: 'Bearer ',
      provider: 'guest',
    }
  }
}

export { checkUserOnInit, constructHeaders, avoidRedunduntRouting }
