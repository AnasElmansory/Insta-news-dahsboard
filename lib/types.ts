export enum ItemType {
  'Source',
  'User',
  'News',
  'Country',
  'Notification',
}

export enum HttpMethods {
  'GET',
  'POST',
  'DELETE',
  'PUT',
}

export type Rules = {
  (value: string): boolean | string
}

export interface FormFields {
  name: string
  type: string
  value: CountrySource[] | string | string[]
  rules?: Rules[]
}
export interface CountrySource {
  id: string
  name: string
}

export default ItemType
