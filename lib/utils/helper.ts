import { NuxtAxiosInstance } from '@nuxtjs/axios/types/index'
import { baseUrl } from '../constants'
import { HttpMethods } from '../types'

interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
  config: any
  request?: any
}

// export default function errorHandler(error: any) {
//   if (error.response) alert(`${error.response.data} ${error.response.status}`)
//   else {
//     alert('something went wrong')
//   }
// }

export async function taskWrapper(
  axios: NuxtAxiosInstance,
  headers: any,
  path: string,
  httpMethod: HttpMethods,
  data?: any,
  params?: any
): Promise<AxiosResponse<any> | string> {
  try {
    let response: AxiosResponse<any>
    switch (httpMethod) {
      case HttpMethods.GET:
        response = await axios.get(baseUrl + path, { headers, params })
        break
      case HttpMethods.POST:
        response = await axios.post(baseUrl + path, data, { headers, params })
        break
      case HttpMethods.PUT:
        response = await axios.put(baseUrl + path, data, { headers, params })
        break
      case HttpMethods.DELETE:
        response = await axios.delete(baseUrl + path, { headers, params })
        break
    }
    return response
  } catch (error: any) {
    let event: string
    if (!error.response.data) {
      event = `${error.response.statusText} status code: ${error.response.status}`
    } else {
      console.log(error.response.data)
      if (error.response.data.includes('<!DOCTYPE html>')) {
        event = `${error.response.statusText} status code: ${error.response.status}`
      } else if (typeof error.response?.data === 'string') {
        event = error.response?.data
      } else if (error.response.data.details) {
        event = error.response.data.details[0].message
      } else {
        const data = JSON.parse(error.response?.data)
        event = data[0].detail
      }
    }
    return event
  }
}

function hightImageUrl(image: string): string {
  return image.replace('normal', '400x400') ?? ''
}

function saveRoute(route: string) {
  if (process.browser) {
    localStorage.setItem('dashboardRoute', route)
  }
}

export { saveRoute, hightImageUrl }
