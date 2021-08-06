import { baseUrl } from './constants'
import User from './models/user'

export default async function getAdminUser(
  id: string,
  access_token: string,
  axios: any
): Promise<false | any> {
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
  } catch (eror) {
    console.error(eror)
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
  googleAuth: any,
  router: any,
  axios: any,
  to: string
) {
  if (googleAuth.isSignedIn.get()) {
    const googleUser = googleAuth.currentUser.get()
    const adminOr = await getAdminUser(
      googleUser.getId(),
      googleUser.Zb.access_token,
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

async function constructHeaders(googleAuth: any) {
  if (await googleAuth.isSignedIn.get()) {
    const googleUser = googleAuth.currentUser.get()
    return {
      Authorization: 'Bearer ' + googleUser.Zb.access_token,
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
