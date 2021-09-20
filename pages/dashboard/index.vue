<template>
  <div class="dashboard"></div>
</template>



<script lang='ts'>
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { avoidRedunduntRouting } from '~/lib/auth'
@Component({})
export default class Dashboard extends Vue {
  mounted() {
    let route: string = '/dashboard/sources'
    if (process.browser) {
      route = localStorage.getItem('dashboardRoute') || '/dashboard/sources'
    }
    avoidRedunduntRouting(this.$router, route)
  }
}
</script>

<style scoped>
.dashboard {
  height: 100%;
}
</style>