<template>
  <v-container fluid>
    <v-card
      :class="countryCardClass"
      @click="openEditDilog"
      elevation="10"
      rounded="xl"
      v-ripple
    >
      <v-img :src="countryFlag" width="64" height="64" contain></v-img>
      <v-card-title>{{ country.countryName }}</v-card-title>
      <v-card-subtitle>{{ country.countryNameAr }}</v-card-subtitle>

      <v-chip-group column>
        <v-chip v-for="(countrySource, index) in country.sources" :key="index">
          {{ countrySource.name }}
        </v-chip>
      </v-chip-group>
    </v-card>

    <Dialog
      v-model="showDialog"
      modelType="Country"
      event="Edit"
      :formFields="formFields"
      @remove-item="onRemoveSource"
      @list-field-add="onAddSource"
      @dialogSubmit="submitEdit"
    />

    <Snackbar
      v-model="showSnackbar"
      :snackbarColor="snackbarColor"
      :snackbarEvent="snackbarEvent"
    />

    <SelectionDialog
      v-model="showSelectionDialog"
      :sources="sources"
      @on-item-selected="updateCountrySources"
    />
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import Snackbar from '~/components/core/Snackbar.vue'
import SelectionDialog from '~/components/core/SelectionDialog.vue'
import Dialog from '~/components/core/Dialog.vue'
import Country from '~/lib/models/country'
import { CountrySource, HttpMethods } from '~/lib/types'
import { flagUrl } from '~/lib/constants'
import { FormFields } from '~/lib/types'
import { constructHeaders } from '~/lib/auth'
import Source from '~/lib/models/source'
import { hightImageUrl, taskWrapper } from '~/lib/utils/helper'
import { getCountriesModule } from '~/store/data'
@Component({
  components: {
    SelectionDialog,
    Snackbar,
    Dialog,
  },
})
export default class CountryWidget extends Vue {
  @Prop({ required: true }) country!: Country
  @Prop({ default: false }) usedInDialog!: boolean

  snackbarEvent: string = ''
  snackbarColor: string = 'success'
  showSnackbar: boolean = false

  showDialog: boolean = false
  showSelectionDialog: boolean = false

  sources: Source[] = []
  formFields: FormFields[] = [
    {
      name: 'Country Name',
      type: 'text-field',
      value: this.country.countryName!,
      rules: [
        (val) => (val!! && val.length < 20) || 'Enter valid Country Name',
      ],
    },
    {
      name: 'Country Name (Arabic)',
      type: 'text-field',
      value: this.country.countryNameAr!,
      rules: [
        (val) => (val!! && val.length < 20) || 'Enter valid Country Name',
        (val) => /[\u0600-\u06ff]/.test(val) || 'Enter Country Name In Arabic',
      ],
    },
    {
      name: 'Country Code',
      type: 'text-field',
      value: this.country.countryCode!,
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
      value:
        this.country.sources?.map((x) => {
          let countrySource: CountrySource = {
            id: x.id,
            name: x.name,
          }
          return countrySource
        }) || [],
    },
  ]

  get countryCardClass(): string {
    return this.usedInDialog ? 'inDialog' : 'countryCard'
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
  sourceImage(image: string): string {
    return hightImageUrl(image)
  }
  onRemoveSource(sourceId: string) {
    let sourceList = this.formFields[3].value as CountrySource[]
    this.formFields[3].value = sourceList.filter((x) => x.id !== sourceId)
  }

  async submitEdit(fields: string[]) {
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
        HttpMethods.PUT,
        country
      )
      if (typeof result === 'string') {
        this.snackbarEvent = result as string
        this.snackbarColor = 'error'
      } else {
        const country = Country.fromJSON(result.data)
        getCountriesModule(this.$store).updateCountry(country)
        this.snackbarEvent = `${country.countryName} is updated successfully`
        this.snackbarColor = 'success'
      }
      this.showSnackbar = true
    })
  }

  openEditDilog() {
    if (!this.usedInDialog) {
      this.showDialog = true
    }
  }
  dismissSelectionDialog() {
    this.showSelectionDialog = false
  }

  get countryFlag(): string {
    return flagUrl(this.country!.countryCode || '')
  }
}
</script>


<style scoped>
.countryCard {
  transition: 0.3s;
  cursor: pointer;
  padding: 16px;
}

.countryCard:hover {
  transform: translateY(-5%);
}

.card {
  overflow: hidden;
  user-select: none;
  box-shadow: 4px 4px 16px gray;
  transition: 0.3s;
}

#closeBtn {
  margin: 8px;
}

#countrySource {
  margin-inline: 16px;
  margin-block: 10px;
  transition: 0.3s;
  cursor: pointer;
}

.card-img-right {
  height: 64px;
  width: 64px;
  margin-inline: 8px;
  margin-block: 8px;
}
</style>