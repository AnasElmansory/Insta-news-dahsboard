<template>
  <v-app>
    <v-container fluid class="authpage">
      <v-progress-circular indeterminate color="info"></v-progress-circular>
    </v-container>
  </v-app>
</template>


<script lang='ts'>
import { Context } from '@nuxt/types'
import { Vue, Component } from 'nuxt-property-decorator'
import getAdminUser from '~/lib/auth'
@Component({})
export default class AuthPage extends Vue {
  mounted() {
    this.google.then(async (auth) => {
      const googleUser = auth.currentUser.get()
      const adminOr = await getAdminUser(
        googleUser.getId(),
        googleUser.getAuthResponse().access_token,
        this.$axios
      )
      if (adminOr === false) {
        this.$router.replace('/sign')
      } else {
        this.$store.commit('signIn', adminOr)
        this.$router.replace('/dashboard')
      }
    })
  }
}
</script>


<style scoped>
.authpage {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
}
</style>