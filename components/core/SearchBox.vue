<template>
  <b-container class="searchbox" data-app>
    <v-text-field
      v-model="query"
      clearable
      outlined
      dense
      :placeholder="hintText"
      prepend-inner-icon="mdi-magnify"
      @keydown.enter="search"
    >
    </v-text-field>

    <v-dialog max-width="500px" v-model="showResultDialog">
      <v-card class="dialog">
        <v-row justify="space-around" align="center" no-gutters>
          <v-card-title class="text-center">Search Result</v-card-title>
          <v-btn text color="error" @click="closeSearch">Close</v-btn>
        </v-row>
        <v-col v-if="searchList.length != 0">
          <widget-factory
            v-for="(item, index) in searchList"
            :key="index"
            :model="item"
            :from="routeName"
          />
        </v-col>

        <v-card-subtitle class="text-center" v-else>
          Nothing Found!
        </v-card-subtitle>
      </v-card>
    </v-dialog>

    <Snackbar
      v-model="showSnackbar"
      :snackbarEvent="snackbarEvent"
      :snackbarColor="snackbarColor"
    />
  </b-container>
</template>



<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import WidgetFactory from '~/components/WidgetFactory.vue'
import Snackbar from '~/components/core/Snackbar.vue'
import Country from '~/lib/models/country'
import Source from '~/lib/models/source'
import Model from '~/lib/models/model'
import News from '~/lib/models/news'
import User from '~/lib/models/user'
import { taskWrapper } from '~/lib/utils/helper'
import { constructHeaders } from '~/lib/auth'
import { HttpMethods } from '~/lib/types'
import Notification from '~/lib/models/notification'
import auth from '~/middleware/auth'
@Component({
  components: {
    WidgetFactory,
    Snackbar,
  },
})
export default class SearchBox extends Vue {
  query: string = ''
  showResultDialog: boolean = false
  searchList: Model[] = []

  snackbarEvent: string = ''
  snackbarColor: string = 'error'
  showSnackbar: boolean = false

  closeSearch() {
    this.showResultDialog = false
  }

  get routeName(): string {
    return this.$router.currentRoute.name?.replace('dashboard-', '') ?? ''
  }
  get hintText(): string {
    return (
      'search ' + this.$router.currentRoute.name?.replace('dashboard-', '') ??
      ''
    )
  }
  async search() {
    let result: Model[] = []
    if (this.routeName === 'sources') {
      result = await this.searchSources()
    } else if (this.routeName === 'users') {
      result = await this.searchUsers()
    } else if (this.routeName === 'news') {
      result = await this.searchNews()
    } else if (this.routeName === 'countries') {
      result = await this.searchCountries()
    } else if (this.routeName === 'notification') {
      result = await this.searchNotification()
    }
    this.searchList = result
    if (!this.showSnackbar) {
      this.showResultDialog = true
    }
  }
  async searchSources(): Promise<Source[]> {
    return this.google.then(async (auth) => {
      const result = await taskWrapper(
        this.$axios,
        await constructHeaders(auth),
        `/control/sources/search/${this.query}`,
        HttpMethods.GET
      )
      if (typeof result === 'string') {
        this.snackbarEvent = result as string
        this.snackbarColor = 'error'
        this.showSnackbar = true
        return []
      } else {
        return result.data as Source[]
      }
    })
  }
  async searchUsers(): Promise<User[]> {
    return this.google.then(async (auth) => {
      if (this.query === '') {
        return []
      }
      const result = await taskWrapper(
        this.$axios,
        await constructHeaders(auth),
        `/control/users/search/`,
        HttpMethods.GET,
        {},
        { query: this.query }
      )
      if (typeof result === 'string') {
        this.snackbarEvent = result as string
        this.snackbarColor = 'error'
        this.showSnackbar = true
        return []
      } else {
        return result.data as User[]
      }
    })
  }
  async searchNews(): Promise<News[]> {
    return this.google.then(async (auth) => {
      const result = await taskWrapper(
        this.$axios,
        await constructHeaders(auth),
        `/control/news/search/`,
        HttpMethods.GET,
        {},
        { query: this.query }
      )
      if (typeof result === 'string') {
        this.snackbarEvent = result as string
        this.snackbarColor = 'error'
        this.showSnackbar = true
        return []
      } else {
        return result.data as News[]
      }
    })
  }
  async searchCountries(): Promise<Country[]> {
    return this.google.then(async (auth) => {
      const result = await taskWrapper(
        this.$axios,
        await constructHeaders(auth),
        `/control/countries/search/${this.query}`,
        HttpMethods.GET
      )
      if (typeof result === 'string') {
        this.snackbarEvent = result as string
        this.snackbarColor = 'error'
        this.showSnackbar = true
        return []
      } else {
        return result.data as News[]
      }
    })
  }
  async searchNotification(): Promise<Notification[]> {
    return this.google.then(async (auth) => {
      const result = await taskWrapper(
        this.$axios,
        await constructHeaders(auth),
        `/control/notification/topics/search/${this.query}`,
        HttpMethods.GET
      )
      if (typeof result === 'string') {
        this.snackbarColor = 'error'
        this.snackbarEvent = result
        this.showSnackbar = true
        return []
      } else {
        return result.data as Notification[]
      }
    })
  }
}
</script>



<style scoped>
.searchbox {
  padding: 16px;
  width: 95%;
  user-select: none;
}
.v-text-field--outlined >>> fieldset {
  border-color: gray;
}
.dialog {
  align-items: center;
}
</style>