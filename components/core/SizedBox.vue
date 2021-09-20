<template>
  <v-container id="sized-box"> </v-container>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'nuxt-property-decorator'
@Component({})
export default class SizedBox extends Vue {
  @Prop({ default: '50px' }) height!: string
  mounted() {
    this.$el.setAttribute('style', `height: ${this.height}`)
  }
}
</script>

<style scoped>
.sized-box {
  user-select: none;
}
</style>
