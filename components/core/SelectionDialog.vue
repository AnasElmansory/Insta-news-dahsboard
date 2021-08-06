<template>
  <v-dialog
    id="s-dialog"
    persistent
    max-width="500"
    v-model="showSelectionDialog"
  >
    <v-card>
      <v-card-title>Search Results</v-card-title>

      <v-card
        id="widgets"
        v-ripple
        v-for="(source, index) in sources"
        :key="index"
        @click="onSelect(source)"
      >
        <v-row no-gutters justify="space-between">
          <v-col cols="9">
            <v-card-title>{{ source.name }}</v-card-title>
            <v-card-subtitle>{{ source.username }}</v-card-subtitle>
          </v-col>
          <v-col>
            <v-avatar id="avatar" right size="80">
              <v-img :src="sourceImage(source.profile_image_url)" />
            </v-avatar>
          </v-col>
        </v-row>
      </v-card>

      <v-row justify="end" no-gutters>
        <v-btn id="closeBtn" text color="success" @click="onClose">Close</v-btn>
      </v-row>
    </v-card>
  </v-dialog>
</template>


<script lang='ts'>
import { Vue, Component, Prop, VModel } from 'nuxt-property-decorator'
import Source from '~/lib/models/source'
import { hightImageUrl } from '~/lib/utils/helper'
@Component({})
export default class SelectionDialog extends Vue {
  @VModel({ default: false }) showSelectionDialog!: boolean
  @Prop({ default: [] }) sources!: Source[]

  sourceImage(image: string): string {
    return hightImageUrl(image)
  }
  onSelect(source: Source) {
    this.$emit('on-item-selected', source)
  }
  onClose() {
    this.showSelectionDialog = false
  }
}
</script>

<style scoped>
#s-dialog {
  user-select: none;
}
#closeBtn {
  margin: 8px;
}

#avatar {
  text-align: center;
  margin: 8px;
}

#widgets {
  transition: 0.3s;
  margin-block: 16px;
  margin-inline: 10px;
}
#widgets:hover {
  cursor: pointer;
  transform: scale(0.9);
}
</style>