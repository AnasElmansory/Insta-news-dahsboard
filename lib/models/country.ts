import { CountrySource } from '../types'
import Model from './model'

export default class Country extends Model {
  countryName?: string
  countryNameAr?: string
  countryCode?: string
  sources?: CountrySource[]
  constructor({
    countryName,
    countryNameAr,
    countryCode,
    sources,
  }: {
    countryName: string
    countryNameAr: string
    countryCode: string
    sources: CountrySource[]
  }) {
    super(countryName)
    this.countryName = countryName
    this.countryNameAr = countryNameAr
    this.countryCode = countryCode
    this.sources = sources
  }
  toJSON?() {
    return { ...this }
  }
  static fromJSON(json: any): Country {
    return new Country({
      countryName: json.countryName,
      countryNameAr: json.countryNameAr,
      countryCode: json.countryCode,
      sources: json.sources,
    })
  }
}
