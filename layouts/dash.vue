<template>
  <v-app>
    <Sidebar v-once class="sidebar" />
    <Nuxt class="view" />
  </v-app>
</template>

<script lang='ts'>
import { Vue, Component } from 'nuxt-property-decorator'
import { checkUserOnInit } from '~/lib/auth'
import Sidebar from '../components/core/SideNavBar.vue'
@Component({
  components: { Sidebar },
})
export default class Dash extends Vue {
  async mounted() {
    let route: string = '/dashboard/sources'
    if (process.browser) {
      route = localStorage.getItem('dashboardRoute') || '/dashboard/sources'
    }
    await checkUserOnInit(
      await Vue.GoogleAuth,
      this.$router,
      this.$axios,
      route
    )
  }
}
</script>

<style scoped>
.dashboard {
  height: 100%;
  width: 100%;
  margin: 0px;
  padding: 0px;
}

.view {
  padding-left: 8px;
  margin-left: 60px;
  width: calc(100% - 60px);
  height: 100%;
  overflow: auto;
}
</style>