<template>
  <v-container fluid>
    <page-view :type="pageType" v-on:setCurrentPage="setCurrentPage">
    </page-view>
    <SizedBox />

    <Dialog
      v-model="showDialog"
      :formFields="formFields"
      :modelType="dialogType"
      event="Add"
      @on-input="onInput"
      @remove-item="onRemoveKeyword"
      @list-field-add="onAddKeyword"
      @on-submit-field="onSubmitField"
      @dialogSubmit="onNotificationSubmit"
    />

    <SelectionDialog
      v-model="showSelectionDialog"
      :sources="sources"
      @on-item-selected="onSourceSelected"
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
import { getNotificationModule } from '~/store/data'
import SelectionDialog from '~/components/core/SelectionDialog.vue'
import SearchBox from '~/components/core/SearchBox.vue'
import SizedBox from '~/components/core/SizedBox.vue'
import PageView from '~/components/PageView.vue'
import Snackbar from '~/components/core/Snackbar.vue'
import Dialog from '~/components/core/Dialog.vue'
import NotificationModule from '~/store/notifications'
import Notification from '~/lib/models/notification'
import ItemType, { FormFields, HttpMethods } from '~/lib/types'
import { constructHeaders } from '~/lib/auth'
import { baseUrl } from '~/lib/constants'
import { saveRoute, taskWrapper } from '~/lib/utils/helper'
import Source from '~/lib/models/source'
@Component({
  components: {
    SelectionDialog,
    SearchBox,
    SizedBox,
    PageView,
    Snackbar,
    Dialog,
  },
  layout(context) {
    return context.payload?.layout ?? 'dash'
  },
})
export default class NotificationPage extends Vue {
  pageType: ItemType = ItemType.Notification
  dialogType: string = 'Notification'

  showDialog: boolean = false

  snackbarEvent: string = ''
  snackbarColor: string = 'success'
  showSnackbar: boolean = false

  showSelectionDialog: boolean = false
  sources: Source[] = []

  formFields: FormFields[] = [
    {
      name: 'Topic username',
      type: 'text-field -search',
      value: '',
      rules: [
        (val) => (!!val && val.length < 20) || 'Enter valid Topic(Source) Name',
      ],
    },
    {
      name: 'Topic Id',
      type: 'read-only text-field',
      value: '',
    },
    {
      name: 'Keywords',
      type: 'list-field ',
      value: [],
    },
  ]

  onInput(value: string, index: number) {
    this.formFields[index].value = value
  }

  async onSubmitField(query: string) {
    this.google.then(async (auth) => {
      const result = await taskWrapper(
        this.$axios,
        await constructHeaders(auth),
        `/control/sources/search/${query}`,
        HttpMethods.GET
      )
      if (typeof result === 'string') {
        this.snackbarColor = 'error'
        this.snackbarEvent = result
        this.showSnackbar = true
      } else {
        this.sources = result.data
        this.showSelectionDialog = true
      }
    })
  }

  onSourceSelected(source: Source) {
    this.formFields[0].value = source.username!
    this.formFields[1].value = source.id!
  }

  onAddKeyword(keyword: string, index: number) {
    let keywords = this.formFields[index].value as string[]
    if (!keywords.includes(keyword)) {
      keywords.push(keyword)
      this.formFields[index].value = keywords
    }
  }
  onRemoveKeyword(keyword: string) {
    this.formFields[2].value = (this.formFields[2].value as string[]).filter(
      (x) => x !== keyword
    )
  }
  async onNotificationSubmit() {
    const notification = {
      username: this.formFields[0].value,
      topic: this.formFields[1].value,
      keywords: this.formFields[2].value as string[],
    }
    this.google.then(async (auth) => {
      const result = await taskWrapper(
        this.$axios,
        await constructHeaders(auth),
        '/control/notification/topics',
        HttpMethods.POST,
        notification
      )
      if (typeof result === 'string') {
        this.snackbarColor = 'error'
        this.snackbarEvent = result
      } else {
        this.snackbarEvent = `${result.data.username} Notifications Rules Is Created Successfully`
        this.snackbarColor = 'success'
        this.notificationModule.addNotification(result.data)
      }
      this.showSnackbar = true
    })
  }

  mounted() {
    saveRoute(this.$router.currentRoute.path)
    const lastPage = this.notificationModule.lastPage
    const currentPage = this.notificationModule.page
    if (
      this.notificationModule.pageItems.length < 10 &&
      lastPage !== currentPage
    ) {
      this.getNotifications(1)
    }
  }

  get notificationModule(): NotificationModule {
    return getNotificationModule(this.$store)
  }

  setCurrentPage(page: number) {
    scrollTo({ top: 0 })
    this.notificationModule.setPage(page)
    const lastPage = this.notificationModule.lastPage
    const currentPage = this.notificationModule.page
    if (
      this.notificationModule.pageItems.length < 10 &&
      lastPage !== currentPage
    ) {
      this.getNotifications(page)
    }
  }

  async getNotifications(page: number) {
    this.google.then(async (auth) => {
      const headers = await constructHeaders(auth)
      const response = await this.$axios.get(
        baseUrl + '/control/notification/topics',
        {
          headers: headers,
          params: { page: page },
        }
      )

      const itemList = response.data.map((x: any) => {
        return Notification.fromJSON(x)
      })

      this.notificationModule.setItems({
        items: itemList,
        pageKey: page,
      })
    })
  }
}
</script>