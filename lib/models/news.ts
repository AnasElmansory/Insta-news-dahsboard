import Model from '~/lib/models/model'
export default class News extends Model {
  id: string
  text: string
  lang?: string
  source?: string
  created_at?: string
  attachments?: object
  media?: object[]
  users: object[]
  constructor({
    id,
    text,
    lang,
    source,
    attachments,
    created_at,
    media,
    users,
  }: {
    id: string
    text: string
    lang?: string
    source?: string
    created_at?: string
    attachments?: object
    media?: object[]
    users: object[]
  }) {
    super(id)
    this.id = id
    this.text = text
    this.lang = lang
    this.created_at = created_at
    this.source = source
    this.attachments = attachments
    this.media = media
    this.users = users
  }

  toJSON() {
    return { ...this }
  }
  static fromJSON(json: any): News {
    return new News({
      id: json.id,
      text: json.text,
      lang: json.lang,
      source: json.Source,
      created_at: json.created_at,
      attachments: json.attachments,
      media: json.media,
      users: json.users,
    })
  }
}
