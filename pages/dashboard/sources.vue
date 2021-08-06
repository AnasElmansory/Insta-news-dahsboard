<template>
  <page-view :type="pageType" v-on:setCurrentPage="setCurrentPage">
    <template #add-dialog>
      <v-dialog max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn fab fixed right bottom dark class="addSourceBtn" v-on="on">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-container>
            <v-form ref="form" @submit.prevent="searchTwitterSource">
              <v-text-field
                v-model="query"
                :rules="twitterSearchRules"
                class="twitterSearch"
                outlined
                color="#808080"
                placeholder="search source on twitter"
              ></v-text-field>
            </v-form>
            <v-row class="center spinner" v-if="loading">
              <b-spinner variant="primary"></b-spinner>
            </v-row>
            <v-row class="center widget" v-if="twitterSource.id !== undefined">
              <SourceWidget :usedInDialog="true" :source="twitterSource" />
            </v-row>
            <v-row class="center">
              <v-btn
                dark
                :disabled="addButtonDisabled"
                class="sourceAddBtn"
                @click="addTwitterSource"
                >Add Source</v-btn
              >
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
    </template>

    <template #snackbar>
      <Snackbar
        v-model="showSnackbar"
        :snackbarColor="snackbarColor"
        :snackbarEvent="snackbarEvent"
      />
    </template>
  </page-view>
</template>


<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { getSourceModule } from '~/store/data'
import SourceWidget from '~/components/sources/SourceWidget.vue'
import SearchBox from '~/components/core/SearchBox.vue'
import Snackbar from '~/components/core/Snackbar.vue'
import PageView from '~/components/PageView.vue'
import Source from '~/lib/models/source'
import ItemType, { HttpMethods, Rules } from '~/lib/types'
import { constructHeaders } from '~/lib/auth'
import { baseUrl } from '~/lib/constants'
import { saveRoute, taskWrapper } from '~/lib/utils/helper'
import SourcesModule from '~/store/sources'
@Component({
  components: {
    PageView,
    Snackbar,
    SearchBox,
    SourceWidget,
  },

  layout: 'dash',
})
export default class Sources extends Vue {
  pageType: ItemType = ItemType.Source
  twitterSource: Source = {}
  query: string = ''
  loading: boolean = false

  snackbarEvent: string = ''
  snackbarColor: string = 'success'
  showSnackbar: boolean = false

  twitterSearchRules: Rules[] = [
    (val) => !!val || 'Enter Source Name!',
    (val) =>
      !/[$-/:-?{-~!@"^`\[\]]/.test(val) || "Can't contain symbols, Ex: # - $ ",
  ]

  $refs!: {
    form: any
  }

  mounted() {
    saveRoute(this.$router.currentRoute.path)
    const lastPage = this.sourceModule.lastPage
    const currentPage = this.sourceModule.page
    if (this.sourceModule.pageItems.length < 10 && lastPage !== currentPage) {
      this.getSources(currentPage)
    }
  }

  get sourceModule(): SourcesModule {
    return getSourceModule(this.$store)
  }

  setCurrentPage(page: number) {
    scrollTo({ top: 0 })
    this.sourceModule.setPage(page)
    const lastPage = this.sourceModule.lastPage
    const currentPage = this.sourceModule.page
    if (this.sourceModule.pageItems.length < 10 && lastPage !== currentPage) {
      this.getSources(page)
    }
  }

  get addButtonDisabled(): boolean {
    if (this.twitterSource.id !== undefined) {
      return false
    } else {
      return true
    }
  }
  async searchTwitterSource() {
    this.loading = true
    if (this.$refs.form.validate()) {
      const result = await taskWrapper(
        this.$axios,
        await constructHeaders(await Vue.GoogleAuth),
        `/control/sources/search/twitter/${this.query}`,
        HttpMethods.GET
      )
      if (typeof result === 'string') {
        console.log(result)
        this.snackbarEvent = result as string
        this.snackbarColor = 'error'
        this.showSnackbar = true
      } else {
        this.twitterSource = Source.fromJSON((result as any).data.data)
      }
      this.loading = false
    }
  }

  async addTwitterSource() {
    if (this.twitterSource.id !== undefined) {
      const result = await taskWrapper(
        this.$axios,
        await constructHeaders(await Vue.GoogleAuth),
        '/control/sources',
        HttpMethods.POST,
        this.twitterSource.toJSON!()
      )

      if (typeof result === 'string') {
        this.snackbarColor = 'error'
        this.snackbarEvent = result as string
        this.showSnackbar = true
      } else {
        this.snackbarColor = 'success'
        this.sourceModule.addTwitterSource(this.twitterSource)
        this.snackbarEvent = `${result.data.name} Is Added To Sources Successfully`
        this.showSnackbar = true
      }
    }
  }
  async getSources(page: number) {
    const auth = await Vue.GoogleAuth
    const headers = await constructHeaders(auth)
    const response = await this.$axios.get(baseUrl + '/control/sources', {
      headers: headers,
      params: { page: page },
    })

    const itemList = response.data.map((x: any) => {
      return Source.fromJSON(x)
    })
    getSourceModule(this.$store).setItems({
      items: itemList,
      pageKey: page,
    })
  }
}
</script>






<style scoped>
.sourceGridContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.sourcesGrid {
  width: 100%;
  padding: 0px;
  margin: 0px;
  justify-content: space-around;
}
.pagingBar {
  bottom: 8px;
  padding: 8px;
  color: #808080;
}
.addSourceBtn {
  margin: 8px;
}
.center {
  margin: 4px;
  justify-content: center;
  align-content: stretch;
}
span {
  margin-left: 8px;
}
.snackbar {
  justify-content: space-between;
  align-items: center;
}
.spinner {
  height: 80px;
}
</style>