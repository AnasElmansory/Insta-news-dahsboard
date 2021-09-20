<template>
  <v-container>
    <page-view :type="type" v-on:setCurrentPage="setCurrentPage"> </page-view>
    <SizedBox />
  </v-container>
</template>

<script lang='ts'>
import { Vue, Component } from 'nuxt-property-decorator'
import UserWidget from '~/components/users/UserWidget.vue'
import { baseUrl } from '~/lib/constants'
import User from '~/lib/models/user'
import { saveRoute } from '~/lib/utils/helper'
import { getUsersModule } from '~/store/data'
import SearchBox from '~/components/core/SearchBox.vue'
import SizedBox from '~/components/core/SizedBox.vue'
import PageView from '~/components/PageView.vue'
import ItemType from '~/lib/types'
import { constructHeaders } from '~/lib/auth'
import UsersModule from '~/store/users'

@Component({
  components: { UserWidget, SearchBox, PageView, SizedBox },
  layout(context) {
    return context.payload?.layout ?? 'dash'
  },
})
export default class Users extends Vue {
  type: ItemType = ItemType.User
  mounted() {
    saveRoute(this.$router.currentRoute.path)
    const lastPage = this.userModule.lastPage
    const currentPage = this.userModule.page
    if (this.userModule.pageItems.length < 10 && lastPage !== currentPage) {
      this.getUsers(1)
    }
  }

  get userModule(): UsersModule {
    return getUsersModule(this.$store)
  }

  setCurrentPage(page: number) {
    scrollTo({ top: 0 })
    this.userModule.setPage(page)
    const lastPage = this.userModule.lastPage
    const currentPage = this.userModule.page
    if (this.userModule.pageItems.length < 10 && lastPage !== currentPage) {
      this.getUsers(page)
    }
  }
  async getUsers(page: number) {
    this.google.then(async (auth) => {
      const headers = await constructHeaders(auth)
      const response = await this.$axios.get(baseUrl + '/control/users', {
        headers: headers,
        params: { page: page },
      })

      const itemList = response.data.map((x: any) => {
        return User.fromJSON(x)
      })

      this.userModule.setItems({
        items: itemList,
        pageKey: page,
      })
    })
  }
}
</script>
<style scoped>
</style>