<template>
  <v-container fluid>
    <SearchBox />

    <v-row align="center">
      <v-col cols="4" v-for="(item, index) in items" :key="index">
        <WidgetFactory :model="item" />
      </v-col>
    </v-row>

    <v-container class="pagingBar" v-if="showPagination">
      <v-pagination
        dark
        color="#808080"
        :value="currentPage"
        total-visible="5"
        :length="currentPageKey"
        @input="setCurrentPage"
      ></v-pagination>
    </v-container>
    <slot name="add-dialog"> </slot>

    <slot name="snackbar"> </slot>
  </v-container>
</template>


<script lang='ts'>
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import {
  getUsersModule,
  getSourceModule,
  getNewsModule,
  getCountriesModule,
  getNotificationModule,
} from '~/store/data'
import WidgetFactory from '~/components/WidgetFactory.vue'
import SearchBox from '~/components/core/SearchBox.vue'
import Model from '~/lib/models/model'
import ItemType from '~/lib/types'

@Component({
  components: { WidgetFactory, SearchBox },
})
export default class PageView extends Vue {
  @Prop({ required: true }) type?: ItemType

  get storeModule() {
    if (this.type === ItemType.Source) {
      return getSourceModule(this.$store)
    } else if (this.type === ItemType.User) {
      return getUsersModule(this.$store)
    } else if (this.type === ItemType.News) {
      return getNewsModule(this.$store)
    } else if (this.type === ItemType.Country) {
      return getCountriesModule(this.$store)
    } else {
      return getNotificationModule(this.$store)
    }
  }

  get items(): Model[] {
    return this.storeModule!.pageItems
  }

  get showPagination(): boolean {
    if (
      this.storeModule!.lastPage === 1 ||
      this.storeModule!.items.length === 0
    ) {
      return false
    } else {
      return true
    }
  }

  get lastPage() {
    return this.storeModule!.lastPage
  }

  get perPage(): number {
    return 10
  }

  get currentPageKey(): number {
    const pageKey = this.storeModule!.pageKey
    if (pageKey === 0) {
      return this.storeModule!.lastPage
    } else {
      return pageKey
    }
  }

  get currentPage(): number {
    return this.storeModule!.currentPage
  }

  setCurrentPage(page: number) {
    this.$emit('setCurrentPage', page)
  }
}
</script>


<style scoped>
</style>