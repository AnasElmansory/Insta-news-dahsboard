<template>
  <v-app>
    <v-container fluid class="sign-page-container">
      <v-card elevation="8">
        <v-layout column align-center justify-center>
          <img src="../static/horizontal_logo.png" alt="INSTA News" />
          <v-layout wrap justify-center>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  id="google-signin-button"
                  v-on="on"
                  fab
                  @click="signInGoogle"
                >
                  <v-icon>mdi-google</v-icon>
                </v-btn>
              </template>
              Log In with Google
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  id="facebook-signin-button"
                  v-on="on"
                  fab
                  @click="signInFacebook"
                >
                  <v-icon>mdi-facebook</v-icon>
                </v-btn>
              </template>
              Log In with Facebook
            </v-tooltip>
          </v-layout>
        </v-layout>
      </v-card>
    </v-container>
    <Snackbar
      v-model="showSnackbar"
      :snackbarEvent="snackbarEvent"
      :snackbarColor="snackbarColor"
    />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Snackbar from '~/components/core/Snackbar.vue'
import User from '~/lib/models/user'

import getAdminUser from '../lib/auth'
export default Vue.extend({
  data() {
    return {
      showSnackbar: false,
      snackbarEvent: '',
      snackbarColor: 'success',
      isFBAuthReady: false,
    }
  },

  components: {
    Snackbar,
  },

  methods: {
    async onSuccess(user: User, accessToken: string) {
      try {
        const adminOr = await getAdminUser(user.id!, accessToken, this.$axios)
        if (adminOr === false) {
          this.snackbarEvent = 'Only INSTA News admins!'
          this.snackbarColor = 'error'
          this.showSnackbar = true
        } else {
          this.$store.commit('signIn', adminOr)
          this.$router.replace('/dashboard/sources')
        }
      } catch (error) {
        this.snackbarEvent = error.error
        this.snackbarColor = 'error'
        this.showSnackbar = true
      }
    },
    onFailure({ error }: { error: string }) {
      this.snackbarEvent = error
      this.snackbarColor = 'error'
      this.showSnackbar = true
    },
    async signInFacebook() {
      this.facebook.login({ scope: 'email', enable_profile_selector: true })
      this.facebook.login((result) => {
        console.log(result.status)
        const accessToken = result.authResponse.accessToken
        this.facebook.api<fb.UserField>(
          '/me',
          { fields: ['id', 'name', 'email', 'profile_pic'] },
          async (response) => {
            const user = new User({
              id: response.id.toString(),
              name: response.name,
              email: response.email,
              avatar: response.profile_pic,
              provider: 'facebook',
              isAuthenticated: true,
            })
            await this.onSuccess(user, accessToken)
          }
        )
      })
    },
    async signInGoogle() {
      this.google.then(async (auth) => {
        const googleUser = await auth.signIn()
        const profile = googleUser.getBasicProfile()
        const accessToken = googleUser.getAuthResponse().access_token
        const user = new User({
          id: profile.getId(),
          name: profile.getName(),
          email: profile.getEmail(),
          avatar: profile.getImageUrl(),
          provider: 'google',
          isAuthenticated: true,
        })
        await this.onSuccess(user, accessToken)
      })
    },
  },
})
</script>



<style scoped>
.sign-page-container {
  display: flex;
  height: 100%;
  width: 100%;
  background-color: #4267b2;
  align-items: center;
  justify-content: center;
  user-select: none;
}

#google-signin-button {
  padding: 8px;
  margin: 8px;
  background-color: #db4437;
  color: #fff;
}
#facebook-signin-button {
  background-color: #4267b2;
  color: #fff;
  padding: 8px;
  margin: 8px;
}

#main-app {
  display: flex;
  min-height: 100%;
  min-width: 100%;
  height: 100%;
  width: 100%;
}

.col {
  justify-content: center;
}
img {
  max-height: 200px;
  max-width: 100%;
  margin: 8px;
}

.v-card {
  border-radius: 15px;
  box-shadow: 0 2px 8px 0px rgb(0, 0, 0, 0.25);
}
</style>