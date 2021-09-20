<template>
  <v-app>
    <Appbar @showSidebar="showSidebar" />
    <Nuxt />
    <MobileSidebar v-model="sidebar" />
  </v-app>
</template>



<script lang='ts'>
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import MobileSidebar from '~/components/core/MobileSidebar.vue'
import SearchBox from '../components/core/SearchBox.vue'
import Appbar from '../components/core/Appbar.vue'

@Component({
  components: {
    MobileSidebar,
    SearchBox,
    Appbar,
  },
})
export default class MobileLayout extends Vue {
  sidebar: boolean = false

  showSidebar() {
    this.sidebar = true
  }
}
</script>


