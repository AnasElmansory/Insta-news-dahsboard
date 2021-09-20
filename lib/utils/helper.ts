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

export function hightImageUrl(image: string): string {
  return image.replace('normal', '400x400') ?? ''
}

export function saveRoute(route: string) {
  if (process.browser) {
    localStorage.setItem('dashboardRoute', route)
  }
}
export const twitRegExp =
  /((https|http):\/\/([a-zA-Z][\.\-\_\@])\w+\/([a-zA-Z1-9]\w+))\w/gi
export function extractTwitterUrl(content: string): string[] | undefined {
  const matches = content.match(twitRegExp)
  return matches?.map((x) => x.toString())
}

export function date_parser(date: string): string {
  const parsedDate = new Date(date)
  return `${parsedDate.getUTCHours()}:${parsedDate.getMinutes()}     ${parsedDate.toLocaleDateString()}`
}
