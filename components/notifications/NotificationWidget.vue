<template>
  <v-container>
    <v-card
      id="notification-card"
      elevation="8"
      v-ripple
      dark
      :color="cardColor"
      @click="openEditDialog"
    >
      <v-card-title id="topic-username"
        >{{ notificationTopic.username }}
      </v-card-title>
      <v-card-subtitle id="topic-id"
        >Id: {{ notificationTopic.topic }}</v-card-subtitle
      >
      <v-chip-group id="keywords" column>
        <v-chip
          v-for="(keyword, index) in notificationTopic.keywords"
          :key="index"
        >
          {{ keyword }}
        </v-chip>
      </v-chip-group>
      <v-btn
        id="delete-btn"
        text
        @click.stop="onDeleteNotification(notificationTopic.topic)"
      >
        <v-icon> mdi-delete </v-icon>
        Delete</v-btn
      >
    </v-card>
    <Dialog
      v-model="showEditDialog"
      event="Edit"
      modelType="Notification"
      :formFields="formFields"
      @remove-item="onRemoveKeyword"
      @list-field-add="onAddKeyword"
      @dialogSubmit="editNotification"
    />
    <Snackbar
      v-model="showSnackbar"
      :snackbarColor="snackbarColor"
      :snackbarEvent="snackbarEvent"
    />
  </v-container>
</template>



<script lang='ts'>
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import Notification from '~/lib/models/notification'
import Snackbar from '~/components/core/Snackbar.vue'
import Dialog from '~/components/core/Dialog.vue'
import { FormFields, HttpMethods } from '~/lib/types'
import { taskWrapper } from '~/lib/utils/helper'
import { constructHeaders } from '~/lib/auth'
import { getNotificationModule } from '~/store/data'
@Component({
  components: { Snackbar, Dialog },
})
export default class NotificationWidget extends Vue {
  @Prop({ required: true }) notificationTopic!: Notification
  colorList: string[] = ['success', 'warning', 'primary', 'secondary']

  showSnackbar: boolean = false
  snackbarColor: string = 'success'
  snackbarEvent: string = ''

  showEditDialog: boolean = false
  showSelectionDialog: boolean = false

  formFields: FormFields[] = [
    {
      name: 'Topic username',
      type: 'text-field read-only -search',
      value: this.notificationTopic.username,
      rules: [
        (val) => (!!val && val.length < 20) || 'Enter valid Topic(Source) Name',
      ],
    },
    {
      name: 'Topic Id',
      type: 'read-only text-field',
      value: this.notificationTopic.topic,
    },
    {
      name: 'Keywords',
      type: 'list-field',
      value: [...(this.notificationTopic.keywords ?? [])],
    },
  ]

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

  openEditDialog() {
    this.showEditDialog = true
  }

  async editNotification() {
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
        HttpMethods.PUT,
        notification
      )
      if (typeof result === 'string') {
        this.snackbarColor = 'error'
        this.snackbarEvent = result
      } else {
        this.snackbarEvent = `${result.data.username} Notifications keywords have been Updated Successfully`
        this.snackbarColor = 'success'
        getNotificationModule(this.$store).updateNotification(result.data)
      }
      this.showSnackbar = true
    })
  }

  async onDeleteNotification(topicId: string) {
    if (!confirm('Are You Sure You Want To Delete This Notification Topic!')) {
      return
    } else {
      await this.deleteNotification(topicId)
    }
  }

  async deleteNotification(topicId: string) {
    this.google.then(async (auth) => {
      const result = await taskWrapper(
        this.$axios,
        await constructHeaders(auth),
        `/control/notification/topics/${topicId}`,
        HttpMethods.DELETE
      )
      if (typeof result === 'string') {
        this.snackbarColor = 'error'
        this.snackbarEvent = result
      } else {
        this.snackbarEvent = `${result.data.username} Notification Topic has been Deleted Successfully`
        this.snackbarColor = 'info'
        getNotificationModule(this.$store).deleteItem(result.data.topic)
      }
      this.showSnackbar = true
    })
  }

  get cardColor(): string {
    const index = Math.floor(Math.random() * 4)
    return this.colorList[index]
  }
}
</script>

<style scoped>
#notification-card {
  user-select: none;
  transition: 0.3s;
  cursor: pointer;
}
#notification-card:hover {
  transform: scale(1.1);
}

#delete-btn {
  margin: 8px;
}

#topic-id {
  padding-bottom: 8px;
}
#keywords {
  padding-inline: 8px;
}
</style>