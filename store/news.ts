import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import News from '~/lib/models/source'

@Module({ name: 'news', namespaced: true, stateFactory: true })
export default class NewsModule extends VuexModule {
  items: News[] = []
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
  mutateItems({ items }: { items: News[] }) {
    for (const news of items) {
      if (!this.items.includes(news)) {
        this.items.push(news)
      }
    }
  }
  @Mutation
  setLastPage(page: number) {
    this.lastPage = page
  }
  @Mutation
  deleteItem(itemId: string) {
    this.items = this.items.filter((x) => x.id !== itemId)
  }
  @Mutation
  addTwitterSource(item: News) {
    const result = this.items.find((x) => x.id === item.id)
    if (!result) {
      this.items.push(item)
    }
  }
  @Action
  setItems({ items, pageKey }: { items: News[]; pageKey: number }) {
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
