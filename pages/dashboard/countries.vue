<template>
  <v-container fluid>
    <page-view :type="pageType" v-on:setCurrentPage="setCurrentPage">
    </page-view>

    <SizedBox />

    <Dialog
      v-model="showDialog"
      :formFields="formFields"
      :modelType="dialogType"
      :event="event"
      @on-input="onInput"
      @list-field-add="onAddSource"
      @dialogSubmit="onAddCountrySubmit"
      @remove-item="removeCountrySource"
    />

    <SelectionDialog
      v-model="showSelectionDialog"
      :sources="sources"
      @on-item-selected="updateCountrySources"
    />

    <Snackbar
      v-model="showSnackbar"
      :snackbarColor="snackbarColor"
      :snackbarEvent="snackbarEvent"
    />
  </v-container>
</template>


<script lang='ts'>
import { Vue, Component } from 'nuxt-property-decorator'
import { getCountriesModule } from '~/store/data'
import CountriesModule from '~/store/countries'
import PageView from '~/components/PageView.vue'
import Snackbar from '~/components/core/Snackbar.vue'
import SizedBox from '~/components/core/SizedBox.vue'
import SelectionDialog from '~/components/core/SelectionDialog.vue'
import Dialog from '~/components/core/Dialog.vue'
import ItemType, { CountrySource, FormFields, HttpMethods } from '~/lib/types'
import Country from '~/lib/models/country'
import { constructHeaders } from '~/lib/auth'
import { baseUrl } from '~/lib/constants'
import { saveRoute, hightImageUrl, taskWrapper } from '~/lib/utils/helper'
import Source from '~/lib/models/source'
@Component({
  components: { SelectionDialog, PageView, Snackbar, Dialog, SizedBox },
  layout(context) {
    return context.payload?.layout ?? 'dash'
  },
})
export default class CountriesPage extends Vue {
  pageType: ItemType = ItemType.Country

  showDialog: boolean = false

  snackbarEvent: string = ''
  snackbarColor: string = 'success'
  showSnackbar: boolean = false

  event: string = 'Add'
  dialogType: string = 'Country'

  showSelectionDialog: boolean = false
  sources: Source[] = []

  formFields: FormFields[] = [
    {
      name: 'Country Name',
      type: 'text-field',
      value: '',
      rules: [
        (val) => (val!! && val.length < 20) || 'Enter valid Country Name',
      ],
    },
    {
      name: 'Country Name (Arabic)',
      type: 'text-field',
      value: '',
      rules: [
        (val) => (val!! && val.length < 20) || 'Enter valid Country Name',
        (val) => /[\u0600-\u06ff]/.test(val) || 'Enter Country Name In Arabic',
      ],
    },
    {
      name: 'Country Code',
      type: 'text-field',
      value: '',
      rules: [
        (val) => !/[\u0600-\u06ff]/.test(val) || 'Country Code in English',
        (val) =>
          (!!val && val.length == 2) ||
          "Country Code Can't be More Than Two Characters",
      ],
    },
    {
      name: 'Sources',
      type: 'list-field -search',
      value: [],
    },
  ]

  mounted() {
    saveRoute(this.$router.currentRoute.path)
    const lastPage = this.countriesModule.lastPage
    const currentPage = this.countriesModule.page
    if (
      this.countriesModule.pageItems.length < 10 &&
      lastPage !== currentPage
    ) {
      this.getCountries(1)
    }
  }

  dismissSelectionDialog() {
    this.showSelectionDialog = false
  }
  dismissSnackbar() {
    this.showSnackbar = false
  }

  updateCountrySources(source: Source) {
    let sourceList = this.formFields[3].value as CountrySource[]
    const countrySource: CountrySource = { id: source.id!, name: source.name! }
    let exists: boolean = false
    for (const item of sourceList) {
      if (item.id === source.id) {
        exists = true
        return
      }
    }
    if (!exists) {
      sourceList.push(countrySource)
      this.formFields[3].value = sourceList
    }
  }
  removeCountrySource(sourceId: string) {
    let sourceList = this.formFields[3].value as CountrySource[]
    this.formFields[3].value = sourceList.filter((x) => x.id !== sourceId)
  }

  onInput(value: string, index: number) {
    this.formFields[index].value = value
  }

  async onAddSource(query: string) {
    this.google.then(async (auth) => {
      const result = await taskWrapper(
        this.$axios,
        await constructHeaders(auth),
        `/control/sources/search/${query}`,
        HttpMethods.GET
      )
      if (typeof result === 'string') {
        this.snackbarEvent = result as string
        this.snackbarColor = 'error'
        this.showSnackbar = true
      } else {
        this.sources = result.data
        this.showSelectionDialog = true
      }
    })
  }
  async onAddCountrySubmit(fields: string[]) {
    const countryName = this.formFields[0].value
    const countryNameAr = this.formFields[1].value
    const countryCode = (this.formFields[2].value as string).toUpperCase()
    const sources = this.formFields[3].value as CountrySource[]
    const country = {
      countryName,
      countryNameAr,
      countryCode,
      sources,
    }
    this.google.then(async (auth) => {
      const result = await taskWrapper(
        this.$axios,
        await constructHeaders(auth),
        '/control/countries',
        HttpMethods.POST,
        country
      )
      if (typeof result === 'string') {
        this.snackbarEvent = result as string
        this.snackbarColor = 'error'
      } else {
        const country = Country.fromJSON(result.data)
        this.snackbarEvent = `${country.countryName} is added successfully`
        this.snackbarColor = 'success'
        this.countriesModule.addCountry(country)
      }
      this.showSnackbar = true
    })
  }

  sourceImage(image: string): string {
    return hightImageUrl(image)
  }

  get countriesModule(): CountriesModule {
    return getCountriesModule(this.$store)
  }

  setCurrentPage(page: number) {
    scrollTo({ top: 0 })
    this.countriesModule.setPage(page)
    const lastPage = this.countriesModule.lastPage
    const currentPage = this.countriesModule.page
    if (
      this.countriesModule.pageItems.length < 10 &&
      lastPage !== currentPage
    ) {
      this.getCountries(page)
    }
  }
  async getCountries(page: number) {
    this.google.then(async (auth) => {
      const headers = await constructHeaders(auth)
      const response = await this.$axios.get(baseUrl + '/control/countries', {
        headers: headers,
        params: { page: page },
      })

      const itemList = response.data.map((x: any) => {
        return Country.fromJSON(x)
      })

      this.countriesModule.setItems({
        items: itemList,
        pageKey: page,
      })
    })
  }
}
</script>

<style scoped>
.card {
  transition: 0.3s;
  padding-block: 8px;
  cursor: pointer;
}
#closeBtn {
  margin: 8px;
}
.card:hover {
  cursor: pointer;
  background-color: rgb(128, 128, 128, 0.2);
  transform: scale(0.8);
}
</style>

