import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import Notification from '~/lib/models/notification'

@Module({ name: 'notifications', namespaced: true, stateFactory: true })
export default class NotificationModule extends VuexModule {
  items: Notification[] = []
  nextPageKey: number = 1
  page: number = 1
  lastPage: number = 0
  @Mutation
  setPageKey(pageKey: number) {
    this.nextPageKey = pageKey
  }
  @Mutation
  setPage(page: number) {
    this.page = page
  }
  @Mutation
  mutateItems({ items }: { items: Notification[] }) {
    for (const notification of items) {
      if (!this.items.includes(notification)) {
        this.items.push(notification)
      }
    }
  }

  @Mutation
  updateNotification(notification: Notification) {
    this.items.map((x) => {
      if (x.topic === notification.topic) {
        x.keywords = notification.keywords
      }
      return x
    })
  }

  @Mutation
  setLastPage(page: number) {
    this.lastPage = page
  }
  @Mutation
  deleteItem(topic: string) {
    this.items = this.items.filter((x) => x.topic !== topic)
  }
  @Mutation
  addNotification(notification: Notification) {
    let exists: boolean = false
    for (const item of this.items) {
      if (
        item.topic === notification.topic ||
        item.username === notification.username ||
        item.keywords === notification.keywords
      ) {
        exists = true
        return
      }
    }
    if (!exists) {
      this.items.push(notification)
    }
  }

  @Action
  setItems({ items, pageKey }: { items: Notification[]; pageKey: number }) {
    this.mutateItems({ items })
    if (items.length === 10) {
      this.setPageKey(pageKey + 1)
    } else {
      this.setPageKey(0)
      this.setLastPage(pageKey)
    }
  }
  get pageKey() {
    return this.nextPageKey
  }
  get currentPage() {
    return this.page
  }
  get pageItems() {
    const start = (this.currentPage - 1) * 10
    const end = start + 10
    return this.items.slice(start, end)
  }
  get itemsCount() {
    return this.items.values.length
  }
}
