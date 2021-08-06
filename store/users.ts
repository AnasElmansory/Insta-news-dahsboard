import {
  Module,
  Mutation,
  VuexModule,
  getModule,
  Action,
} from 'vuex-module-decorators'
import User from '~/lib/models/user'

@Module({ name: 'users', namespaced: true, stateFactory: true })
export default class UsersModule extends VuexModule {
  items: User[] = []
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
  mutateItems({ items }: { items: User[] }) {
    for (const user of items) {
      if (!this.items.includes(user)) this.items.push(user)
    }
  }

  @Mutation
  updateUserPermission({
    userId,
    permission,
  }: {
    userId: string
    permission: string
  }) {
    this.items = this.items.map((x) => {
      if (x.id === userId) {
        x.permission = permission
      }
      return x
    })
  }

  @Mutation
  setLastPage(page: number) {
    this.lastPage = page
  }

  @Mutation
  deleteItem(userId: string) {
    this.items = this.items.filter((x) => x.id !== userId)
  }

  @Action
  setItems({ items, pageKey }: { items: User[]; pageKey: number }) {
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
