import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import Source from '~/lib/models/source'

@Module({ name: 'sources', namespaced: true, stateFactory: true })
export default class SourcesModule extends VuexModule {
  items: Source[] = []
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
  mutateItems({ items }: { items: Source[] }) {
    for (const source of items) {
      let exists: boolean = false
      for (const item of this.items) {
        if (source.id === item.id) {
          exists = true
          return
        }
      }
      if (!exists) {
        this.items.push(source)
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
  addTwitterSource(item: Source) {
    const result = this.items.findIndex((x) => x.id === item.id)
    if (result === -1) {
      this.items.push(item)
    }
  }
  @Action
  setItems({ items, pageKey }: { items: Source[]; pageKey: number }) {
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
