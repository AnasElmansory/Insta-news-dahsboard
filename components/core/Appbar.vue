<template>
  <v-row id="app-bar" align="start">
    <v-col cols="2">
      <v-btn icon @click="showSidebar">
        <v-icon> mdi-menu </v-icon>
      </v-btn>
    </v-col>
    <v-col>
      <SearchBox id="mobile-search-box" />
    </v-col>
  </v-row>
</template>





<script lang='ts'>
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import SearchBox from '~/components/core/SearchBox.vue'
@Component({
  components: {
    SearchBox,
  },
})
export default class Appbar extends Vue {
  showSidebar() {
    this.$emit('showSidebar')
  }
}
</script>





<style scoped>
#mobile-search-box {
  padding: 0px;
  margin: 0px;
}
#app-bar {
  margin-top: 8px;
  margin-inline: 2px;
  max-height: 10%;
}
</style>