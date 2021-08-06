<template>
  <v-card elevation="10" outlined shaped>
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
                v-on="on"
                text
                color="success"
                @click="adminizeUser(user.id)"
              >
                adminize
              </v-btn>
            </template>
            grant admin permission
          </v-tooltip>
          <v-btn text color="error" @click="deleteUser(user.id)">
            delete
          </v-btn>
        </v-card-actions>

        <!-- <v-snackbar v-model="showSnackbar" :color="snackbarColor" top>
          <v-row justify="space-between" align="center">
            <v-col cols="9">
              {{ snackEvent }}
            </v-col>
            <v-col cols="3">
              <v-btn id="closeSnackBtn" text small @click="dismissSnackbar">
                Close
              </v-btn>
            </v-col>
          </v-row>
        </v-snackbar> -->
      </v-col>
      <v-col cols="4">
        <v-img contain :src="user.avatar"></v-img>
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

  async deleteUser(userId: string) {
    if (!confirm('Are You Sure You Want To Delete this User')) {
      return
    } else {
      const result = await taskWrapper(
        this.$axios,
        await constructHeaders(await Vue.GoogleAuth),
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
    }
  }
  async adminizeUser(userId: string) {
    if (
      !confirm('Are You Sure You Want To Grant This User Editor Permission')
    ) {
      return
    } else {
      const result = await taskWrapper(
        this.$axios,
        await constructHeaders(await Vue.GoogleAuth),
        `/control/users/grant_admin_permission/${userId}`,
        HttpMethods.PUT
      )
      if (typeof result === 'string') {
        this.snackbarColor = 'error'
        this.snackbarEvent = result
      } else {
        getUsersModule(this.$store).updateUserPermission({
          userId: result.data.id,
          permission: result.data.permission,
        })
        this.snackbarColor = 'success'
        this.snackbarEvent = `${result.data.name} becomes an Editor`
      }
      this.showSnackbar = true
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
</style>