<template>
  <v-container>
    <v-snackbar id="snackbar" top v-model="showSnackbar" :color="snackbarColor">
      <v-row justify="space-between" align="center" no-gutters>
        <v-col cols="9">{{ snackbarEvent }} </v-col>
        <v-col cols="3">
          <v-btn text @click="closeSnackbar">Close</v-btn>
        </v-col>
      </v-row>
    </v-snackbar>
  </v-container>
</template>


<script lang='ts'>
import { Vue, Component, Prop, VModel } from 'nuxt-property-decorator'
@Component({})
export default class SnackBar extends Vue {
  @VModel({ default: false }) showSnackbar!: boolean
  @Prop({ required: true }) snackbarEvent!: string
  @Prop({ default: 'success' }) snackbarColor!: string

  closeSnackbar() {
    this.showSnackbar = false
  }
}
</script>

<style scoped>
#snackbar {
  user-select: none;
}
</style>