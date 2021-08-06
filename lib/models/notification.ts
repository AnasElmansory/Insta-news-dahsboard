import Model from '~/lib/models/model'
export default class Notification extends Model {
  topic: string
  username: string
  keywords: string[]
  constructor(topic: string, username: string, keywords: string[]) {
    super(topic)
    this.topic = topic
    this.username = username
    this.keywords = keywords
  }

  toJSON() {
    return { ...this }
  }
  static fromJSON(json: any) {
    return new Notification(json.topic, json.username, json.keywords)
  }
}
