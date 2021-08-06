<template>
  <v-app>
    <div class="authpage">
      <b-spinner variant="primary"></b-spinner>
    </div>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import getAdminUser from '../lib/auth'

export default Vue.extend({
  async mounted() {
    await this.verifyUser()
  },
  methods: {
    async verifyUser() {
      const auth2 = await Vue.GoogleAuth
      const isSignedIn = auth2.isSignedIn.get()
      if (isSignedIn) {
        const user = auth2.currentUser.get()
        if (user) {
          const adminOr = await getAdminUser(
            user.getId(),
            user.Zb.access_token,
            this.$axios
          )
          if (adminOr === false) {
            return this.$router.replace('/sign')
          } else {
            this.$store.commit('signIn', adminOr)

            this.$router.replace('/dashboard')
          }
        }
      } else {
        return this.$router.replace('/sign')
      }
    },
  },
})
</script>


<style scoped>
.authpage {
  display: flex;
  position: fixed;
  width: 100%;
  top: 50%;
  justify-content: center;
  align-items: center;
}
</style>