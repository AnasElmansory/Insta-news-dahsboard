<template>
  <v-app>
    <v-container id="wrap-container" fluid>
      <v-card elevation="20" class="signBox">
        <img src="../static/horizontal_logo.png" alt="INSTA News" />

        <v-btn color="error" height="50" @click="signIn">
          <v-icon left>mdi-google</v-icon>

          Sign In With Google
        </v-btn>
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

import getAdminUser from '../lib/auth'
export default Vue.extend({
  data() {
    return {
      showSnackbar: false,
      snackbarEvent: '',
      snackbarColor: 'success',
    }
  },

  components: {
    Snackbar,
  },
  methods: {
    async signIn() {
      let googleUser: any
      try {
        googleUser = await (await Vue.GoogleAuth).signIn()
      } catch (error) {
        this.snackbarEvent = error.error
        this.snackbarColor = 'error'
        this.showSnackbar = true
      }
      if (!googleUser) {
        return
      } else {
        const adminOr = await getAdminUser(
          googleUser.getId(),
          googleUser.Zb.access_token,
          this.$axios
        )
        if (adminOr === false) {
          return
        } else {
          this.$store.commit('signIn', adminOr)
          this.$router.replace('/dashboard/sources')
        }
      }
    },
  },
})
</script>



<style scoped>
.signBox {
  top: 25%;
  left: 30%;
  width: 40%;
  height: 50%;
  position: fixed;
  display: flex;
  flex-flow: column;
  justify-content: space-around;
  align-items: center;
  border-radius: 15px;
  user-select: none;
}
#wrap-container {
  background-color: #4267b2;
  height: 100vh;
}

img {
  max-height: 150px;
  max-width: 300px;
}

.buttonBar {
  display: flex;
}
#googleButton {
  transition: 0.4s;
  /* background: #db4437; */
  /* color: #fff; */
  /* border-radius: 6px; */
  /* box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.26); */
  /* border: 1px solid #fff; */
  margin: 10px;
  padding: 10px;
  word-wrap: none;
}
/* #googleButton:hover {
  transition: 0.4s;
  background: #db4437;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.26);
  /* border: 1px solid #fff; */
/* } */

#googleIcon {
  color: #fff;
}
</style>