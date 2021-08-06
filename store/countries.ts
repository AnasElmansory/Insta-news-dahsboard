import { Module, Mutation, VuexModule, Action } from 'vuex-module-decorators'
import Country from '~/lib/models/country'

@Module({ name: 'countries', namespaced: true, stateFactory: true })
export default class CountriesModule extends VuexModule {
  items: Country[] = []
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
  mutateItems({ items }: { items: Country[] }) {
    for (const country of items) {
      if (!this.items.includes(country)) {
        this.items.push(country)
      }
    }
  }

  @Mutation
  updateCountry(country: Country) {
    this.items.map((x) => {
      if (x.countryCode === country.countryCode) {
        x.sources = country.sources
      }
      return x
    })
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
  addCountry(country: Country) {
    let exists: boolean = false
    for (const item of this.items) {
      if (
        item.countryName === country.countryName ||
        item.countryCode === country.countryCode ||
        item.countryNameAr === country.countryNameAr
      ) {
        exists = true
        return
      }
    }
    if (!exists) {
      this.items.push(country)
    }
  }

  @Action
  setItems({ items, pageKey }: { items: Country[]; pageKey: number }) {
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
