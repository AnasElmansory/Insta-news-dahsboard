<template>
  <v-container fluid>
    <page-view :type="pageType" v-on:setCurrentPage="setCurrentPage">
    </page-view>
    <SizedBox />

    <v-btn fab bottom dark right fixed @click="updateFeedingState">
      <v-icon v-if="isFeeding">mdi-wifi-sync</v-icon>
      <v-icon v-else>mdi-wifi-off</v-icon>
    </v-btn>

    <v-snackbar v-model="showSnackbar" top :color="snackbarColor">
      <v-row justify="space-between" align="center">
        <v-col cols="8">
          {{ snackbarEvent }}
        </v-col>
        <v-col cols="4">
          <v-btn text @click="dismissSnackbar"> Close </v-btn>
        </v-col>
      </v-row>
    </v-snackbar>
  </v-container>
</template>


<script lang='ts'>
import { Vue, Component } from 'nuxt-property-decorator'
import { getNewsModule } from '~/store/data'
import NewsModule from '~/store/news'
import PageView from '~/components/PageView.vue'
import SizedBox from '~/components/core/SizedBox.vue'
import ItemType, { HttpMethods } from '~/lib/types'
import News from '~/lib/models/news'
import { constructHeaders } from '~/lib/auth'
import { baseUrl } from '~/lib/constants'
import { saveRoute, taskWrapper } from '~/lib/utils/helper'
@Component({
  components: { PageView, SizedBox },
  layout(context) {
    return context.payload?.layout ?? 'dash'
  },
})
export default class NewsPage extends Vue {
  pageType: ItemType = ItemType.News
  snackbarEvent: string = ''
  snackbarColor: string = 'success'
  showSnackbar: boolean = false
  isFeeding: boolean = false

  mounted() {
    saveRoute(this.$router.currentRoute.path)
    const lastPage = this.newsModule.lastPage
    const currentPage = this.newsModule.page
    if (this.newsModule.pageItems.length < 10 && lastPage !== currentPage) {
      this.getNews(1)
    }
    this.getFeedingState()
  }

  dismissSnackbar() {
    this.showSnackbar = false
  }

  async getFeedingState() {
    this.google.then(async (auth) => {
      const result = await taskWrapper(
        this.$axios,
        await constructHeaders(auth),
        '/control/feeding',
        HttpMethods.GET
      )
      if (typeof result === 'string') {
        this.snackbarEvent = result as string
        this.snackbarColor = 'error'
        this.showSnackbar = true
      } else {
        this.isFeeding = result.data.feeding
        if (this.isFeeding) {
          this.snackbarColor = 'success'
          this.snackbarEvent = 'Feeding News Is Working'
        } else {
          this.snackbarColor = 'warning'
          this.snackbarEvent = 'Feeding News Is NOT Working'
        }
        this.showSnackbar = true
      }
    })
  }

  async updateFeedingState() {
    let response: any
    this.google.then(async (auth) => {
      if (this.isFeeding === true) {
        const result = await taskWrapper(
          this.$axios,
          await constructHeaders(auth),
          '/control/stopfeeding',
          HttpMethods.POST
        )
        if (typeof result === 'string') {
          this.snackbarColor = 'error'
          this.snackbarEvent = result
          this.showSnackbar = true
          return
        } else {
          response = result.data
        }
      } else {
        const result = await taskWrapper(
          this.$axios,
          await constructHeaders(auth),
          '/control/startfeeding',
          HttpMethods.POST
        )
        if (typeof result === 'string') {
          this.snackbarColor = 'error'
          this.snackbarEvent = result
          this.showSnackbar = true
          return
        } else {
          response = result.data
        }
      }
      this.isFeeding = response.feeding
      if (this.isFeeding) {
        this.snackbarColor = 'success'
        this.snackbarEvent = 'Feeding News Is Working'
      } else {
        this.snackbarColor = 'warning'
        this.snackbarEvent = 'Feeding News Is NOT Working'
      }
      this.showSnackbar = true
    })
  }

  get newsModule(): NewsModule {
    return getNewsModule(this.$store)
  }

  setCurrentPage(page: number) {
    scrollTo({ top: 0 })
    this.newsModule.setPage(page)
    const lastPage = this.newsModule.lastPage
    const currentPage = this.newsModule.page
    if (this.newsModule.pageItems.length < 10 && lastPage !== currentPage) {
      this.getNews(page)
    }
  }
  async getNews(page: number) {
    this.google.then(async (auth) => {
      const headers = await constructHeaders(auth)
      const response = await this.$axios.get(baseUrl + '/control/news', {
        headers: headers,
        params: { page: page },
      })

      const itemList = response.data.map((x: any) => {
        return News.fromJSON(x)
      })

      this.newsModule.setItems({
        items: itemList,
        pageKey: page,
      })
    })
  }
}
</script>

