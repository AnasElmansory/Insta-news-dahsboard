import Model from './model'

export default class Source extends Model {
  id?: string
  name?: string
  username?: string
  profile_image_url?: string
  url?: string
  location?: string
  description?: string
  created_at?: string
  verified?: boolean
  constructor(
    id: string,
    name: string,
    username: string,
    profile_image_url: string,
    url?: string,
    location?: string,
    description?: string,
    created_at?: string,
    verified?: boolean
  ) {
    super(id)
    this.id = id
    this.name = name
    this.username = username
    this.description = description
    this.profile_image_url = profile_image_url
    this.created_at = created_at
    this.location = location
    this.url = url
    this.verified = verified
  }
  toJSON?() {
    return { ...this }
  }
  static fromJSON(json: any): Source {
    return new Source(
      json.id,
      json.name,
      json.username,
      json.profile_image_url,
      json.url,
      json.location,
      json.description,
      json.created_at,
      json.verified
    )
  }
}
