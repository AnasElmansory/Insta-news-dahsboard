<template>
  <v-card elevation="10" outlined>
    <v-col>
      <v-row>
        <v-avatar class="avatar" size="4rem">
          <v-img :src="imageUrl"></v-img>
        </v-avatar>
        <v-col>
          <v-card-title id="title">{{ news.users[0].name }}</v-card-title>
          <v-card-subtitle id="email">{{
            news.users[0].username
          }}</v-card-subtitle>
        </v-col>
      </v-row>
      <v-card-text class="content">{{ news.text }}</v-card-text>
      <v-card-subtitle class="date">{{ news.created_at }}</v-card-subtitle>
    </v-col>
  </v-card>
</template>



<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import News from '~/lib/models/news'
import Source from '~/lib/models/source'
import { hightImageUrl } from '~/lib/utils/helper'
@Component({})
export default class NewsWidget extends Vue {
  @Prop({ required: true }) news!: News
  showSnackbar: boolean = false
  snackEvent: string = ''
  snackbarColor: string = 'success'

  get imageUrl(): string {
    return hightImageUrl((this.news.users[0] as Source)!.profile_image_url!)
  }

  dismissSnackbar() {
    this.showSnackbar = false
  }
}
</script>
<style scoped>
.avatar {
  margin-left: 16px;
  margin-top: 16px;
}
.content {
  padding-block: 4px;
  margin-top: 8px;
  font-size: 20px;
  color: rgb(0, 0, 0, 0.8);
  text-align: right;
}
#alert {
  margin-inline: 4px;
}

#title {
  margin: 0px;
  padding-block: 4px;
  justify-content: flex-end;
}
#email {
  margin: 0px;
  padding-block: 4px;
  text-align: right;
  color: rgb(0, 0, 0, 0.9);
}
</style>