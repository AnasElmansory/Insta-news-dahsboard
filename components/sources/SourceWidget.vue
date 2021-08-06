<template>
  <b-card class="sourceWidget" img-left>
    <b-row class="avatarBox" no-gutters>
      <b-avatar :src="imageUrl" size="4rem"> </b-avatar>
      <b-row class="actionButtons" v-show="!usedInDialog" no-gutters>
        <v-btn
          class="button deleteButton"
          @click="deleteSource(source.id)"
          icon
        >
          <v-icon size="2rem">mdi-delete</v-icon>
        </v-btn>
        <v-dialog max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn class="button editButton" icon v-on="on">
              <v-icon size="2rem">mdi-pen</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-container>
              <v-text-field
                v-model="query"
                class="countrySearch"
                outlined
                color="#808080"
                placeholder="search country"
                @keydown.enter="searchCountry"
              ></v-text-field>
              <v-row class="center spinner" v-if="loading">
                <b-spinner variant="primary"></b-spinner>
              </v-row>
              <v-row class="center widget" v-if="isCountry">
                <CountryWidget
                  :usedInDialog="true"
                  v-for="(country, index) in countryList"
                  :key="index"
                  :country="country"
                />
              </v-row>
              <v-row class="center">
                <v-btn
                  dark
                  :disabled="editSourceBtnDisabled"
                  class="sourceAddBtn"
                  @click="editSourceCountries"
                  >Add source to country</v-btn
                >
              </v-row>
            </v-container>
          </v-card>
        </v-dialog>
      </b-row>
    </b-row>
    <b-card-title>{{ source.name }}</b-card-title>
    <b-card-subTitle>{{ '@' + source.username }}</b-card-subTitle>
    <b-card-text class="description"> {{ source.description }} </b-card-text>
    <Snackbar
      v-model="showSnackbar"
      :snackbarEvent="snackbarEvent"
      :snackbarColor="snackbarColor"
    />
  </b-card>
</template>


<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { getSourceModule } from '~/store/data'
import CountryWidget from '~/components/countries/CountryWidget.vue'
import Snackbar from '~/components/core/Snackbar.vue'
import Source from '~/lib/models/source'
import Country from '~/lib/models/country'
import { hightImageUrl, taskWrapper } from '~/lib/utils/helper'
import { constructHeaders } from '~/lib/auth'
import { HttpMethods } from '~/lib/types'
@Component({
  components: {
    CountryWidget,
    Snackbar,
  },
})
export default class Sources extends Vue {
  @Prop() source!: Source
  @Prop({ default: false }) usedInDialog!: boolean
  query: string = ''
  loading: boolean = false
  countryList: Country[] = []

  snackbarEvent: string = ''
  snackbarColor: string = 'sucess'
  showSnackbar: boolean = false

  get editSourceBtnDisabled(): boolean {
    return false
  }

  get isCountry(): boolean {
    if (this.countryList.length !== 0) {
      return true
    } else {
      return false
    }
  }

  get imageUrl(): string {
    return hightImageUrl(this.source!.profile_image_url!)
  }

  async deleteSource(sourceId: string) {
    if (!confirm('Are you sure you want to DELETE this Source!')) {
      return
    } else {
      const result = await taskWrapper(
        this.$axios,
        await constructHeaders(await Vue.GoogleAuth),
        `/control/sources/${sourceId}`,
        HttpMethods.DELETE
      )
      if (typeof result === 'string') {
        this.snackbarEvent = result
        this.snackbarColor = 'error'
        this.showSnackbar = true
      } else {
        const source = (result as any).data as Source
        this.snackbarEvent = `${source.name!} successfuly deleted`
        this.snackbarColor = 'warning'
        this.showSnackbar = true
        getSourceModule(this.$store).deleteItem(source.id!)
      }
    }
  }

  async searchCountry() {
    this.loading = true
    const result = await taskWrapper(
      this.$axios,
      await constructHeaders(await Vue.GoogleAuth),
      `/control/countries/search/${this.query}`,
      HttpMethods.GET
    )
    if (typeof result === 'string') {
      this.snackbarEvent = result
      this.snackbarColor = 'error'
      this.showSnackbar = true
    } else {
      const response = result as any
      this.countryList = response.data.map((x: any) => Country.fromJSON(x))
    }

    this.loading = false
  }

  async editSourceCountries() {
    for (const country of this.countryList) {
      const countrySource = { id: this.source.id!, name: this.source.name! }
      let exists: boolean = false
      for (const _countrySource of country.sources!) {
        if (_countrySource.id === countrySource.id) {
          exists = true
          return
        }
      }
      if (!exists) {
        country.sources?.push(countrySource)
        const data = {
          countryName: country.countryName,
          countryNameAr: country.countryNameAr,
          countryCode: country.countryCode,
          sources: country.sources?.map((x) => {
            return { id: x.id, name: x.name }
          }),
        }
        const result = await taskWrapper(
          this.$axios,
          await constructHeaders(await Vue.GoogleAuth),
          '/control/countries',
          HttpMethods.PUT,
          data
        )
        if (typeof result === 'string') {
          this.snackbarEvent = result
          this.snackbarColor = 'error'
        } else {
          const source = (result as any).data as Source
          getSourceModule(this.$store).deleteItem(source.id!)
          this.snackbarEvent = 'Countries Have Been Updated'
          this.snackbarColor = 'success'
        }
        this.showSnackbar = true
      }
    }
  }
}
</script>

<style scoped>
.sourceWidget {
  width: 60vh;
  margin: 8px;
  border-radius: 15px;
  box-shadow: 0 5px 5px rgb(0, 0, 0, 0.2);
  align-self: center;
}
.sourceAvatar {
  align-self: center;
}

.sourceContent {
  padding: 8px;
}
.avatarBox {
  justify-content: space-between;
  align-items: center;
}
.actionButtons {
  justify-content: flex-end;
}
.button {
  width: 30px;
  height: 30px;
  margin: 0 4px;
  transition: 0.5s;
}
.button:hover {
  transform: scale(1.2);

  cursor: pointer;
}
.button.deleteButton {
  color: #bb2323;
}
.button.editButton {
  color: rgb(32, 32, 73);
}
span {
  margin-left: 8px;
}
.snackbar {
  justify-content: space-between;
  align-items: center;
}
.center {
  justify-content: center;
  margin: 4px;
}
</style>