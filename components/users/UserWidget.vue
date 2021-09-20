<template>
  <v-card elevation="10" min-width="300" outlined shaped>
    <v-row>
      <v-col cols="8">
        <v-card-title>{{ user.name }}</v-card-title>
        <v-card-subtitle id="email">{{ user.email }}</v-card-subtitle>
        <v-card-subtitle class="userInfo"
          >Permission: {{ user.permission }}</v-card-subtitle
        >
        <v-card-subtitle class="userInfo"
          >Auth Provider: {{ user.provider || 'google' }}</v-card-subtitle
        >
        <v-card-actions>
          <v-tooltip fixed bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                v-show="enableAdminization"
                v-on="on"
                text
                color="success"
                @click="adminization(user.id)"
              >
                {{ adminizationBtnText }}
              </v-btn>
            </template>
            grant admin permission
          </v-tooltip>

          <v-btn
            v-show="enableDelete"
            text
            color="error"
            @click="deleteUser(user.id)"
          >
            delete
          </v-btn>
        </v-card-actions>
      </v-col>
      <v-col cols="4">
        <img v-if="isGuest" src="../../static/user_placeholder.png" />
        <v-img v-else contain :src="user.avatar"></v-img>
      </v-col>
    </v-row>
    <Snackbar
      v-model="showSnackbar"
      :snackbarEvent="snackbarEvent"
      :snackbarColor="snackbarColor"
    />
  </v-card>
</template>



<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import Snackbar from '~/components/core/Snackbar.vue'
import User from '~/lib/models/user'
import { constructHeaders } from '~/lib/auth'
import { getUsersModule } from '~/store/data'
import { HttpMethods } from '~/lib/types'
import { taskWrapper } from '~/lib/utils/helper'
@Component({
  components: {
    Snackbar,
  },
})
export default class UserWidget extends Vue {
  @Prop({ required: true }) user!: User
  showSnackbar: boolean = false
  snackbarEvent: string = ''
  snackbarColor: string = 'success'

  dismissSnackbar() {
    this.showSnackbar = false
  }

  get isOwner(): boolean {
    if (this.user.permission === 'owner') {
      return true
    } else {
      return false
    }
  }

  get isUser(): boolean {
    if (this.isGuest) {
      return false
    } else if (
      this.user.permission === 'user' ||
      this.user.permission === 'none' ||
      this.user.permission === null
    ) {
      return true
    } else return false
  }

  get isGuest(): boolean {
    if (this.user.name === 'Guest') {
      return true
    } else {
      return false
    }
  }

  get isEditor(): boolean {
    if (this.user.permission === 'editor') {
      return true
    } else {
      return false
    }
  }

  get isMe() {
    if (this.user.id === this.$store.getters.userInfo.id) {
      return true
    } else {
      return false
    }
  }

  get enableDelete(): boolean {
    if (this.isMe || this.isOwner) {
      return false
    } else {
      return true
    }
  }
  get enableAdminization(): boolean {
    if (this.isMe || this.isOwner || this.isGuest) {
      return false
    } else {
      return true
    }
  }

  get adminizationBtnText(): string {
    if (this.isUser) {
      return 'Adminize'
    } else {
      return 'unAdminize'
    }
  }

  async deleteUser(userId: string) {
    if (
      !(await this.$bvModal.msgBoxConfirm(
        'Are You Sure You Want To Delete this User ?!',
        {
          cancelVariant: 'info',
          okVariant: 'success',
          footerTextVariant: 'light',
        }
      ))
    ) {
      return
    } else {
      this.google.then(async (auth) => {
        const result = await taskWrapper(
          this.$axios,
          await constructHeaders(auth),
          `/control/users/${userId}`,
          HttpMethods.DELETE
        )
        if (typeof result === 'string') {
          this.snackbarColor = 'error'
          this.snackbarEvent = result
        } else {
          getUsersModule(this.$store).deleteItem(result.data.id)
          this.snackbarColor = 'warning'
          this.snackbarEvent = `${result.data.name} has been deleted`
        }
        this.showSnackbar = true
      })
    }
  }
  async adminization(userId: string) {
    const confirmationText = this.isUser
      ? 'Are You Sure You Want To Grant This User Editor Permission ?!'
      : 'Confirm revoke User from Editor permission ?!'

    if (
      !(await this.$bvModal.msgBoxConfirm(confirmationText, {
        cancelVariant: 'error',
        okVariant: 'success',
        footerTextVariant: 'light',
      }))
    ) {
      return
    } else {
      this.google.then(async (auth) => {
        const result = await taskWrapper(
          this.$axios,
          await constructHeaders(auth),
          `/control/users/grant_admin_permission/${userId}`,
          HttpMethods.PUT,
          { permission: this.isUser ? 'editor' : 'user' }
        )
        if (typeof result === 'string') {
          this.snackbarColor = 'error'
          this.snackbarEvent = result
        } else {
          const snackbarEvent = this.isUser
            ? `${result.data.name} becomes an Editor`
            : `${result.data.name} becomes a regular user`
          getUsersModule(this.$store).updateUserPermission({
            userId: result.data.id,
            permission: result.data.permission,
          })
          this.snackbarColor = 'success'
          this.snackbarEvent = snackbarEvent
        }
        this.showSnackbar = true
      })
    }
  }
}
</script>
<style scoped>
.userInfo {
  padding-block: 4px;
  color: rgb(0, 0, 0, 0.88);
}
#alert {
  margin-inline: 4px;
}
#email {
  color: rgb(0, 0, 0, 0.9);
}

img {
  max-width: 100%;
  max-height: 100%;
}
</style>