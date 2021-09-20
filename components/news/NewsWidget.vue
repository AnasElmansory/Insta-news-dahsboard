<template>
  <v-card elevation="10" outlined min-width="300">
    <v-col>
      <v-row>
        <v-avatar class="avatar" size="4rem">
          <v-img :src="imageUrl"></v-img>
        </v-avatar>
        <v-col>
          <v-card-title id="name">{{ news.users[0].name }}</v-card-title>
          <v-card-subtitle id="username"
            >@{{ news.users[0].username }}</v-card-subtitle
          >
        </v-col>
      </v-row>
      <v-card-text class="content">{{ news.text }}</v-card-text>
      <v-card-subtitle class="date">{{ newsDate }}</v-card-subtitle>
    </v-col>
  </v-card>
</template>



<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import News from '~/lib/models/news'
import Source from '~/lib/models/source'
import {
  date_parser,
  extractTwitterUrl,
  hightImageUrl,
  twitRegExp,
} from '~/lib/utils/helper'
@Component({})
export default class NewsWidget extends Vue {
  @Prop({ required: true }) news!: News
  showSnackbar: boolean = false
  snackEvent: string = ''
  snackbarColor: string = 'success'

  get newsDate(): string {
    return date_parser(this.news.created_at!)
  }

  get imageUrl(): string {
    return hightImageUrl((this.news.users[0] as Source)!.profile_image_url!)
  }

  mounted() {
    const element = this.$el.getElementsByClassName('content')
    const content = element.item(0)!

    const links = extractTwitterUrl(content.textContent!)
    content.textContent = content.textContent?.replaceAll(twitRegExp, '')!
    links?.forEach((link) => {
      const linkElement = document.createElement('a')
      linkElement.className = 'link'
      linkElement.id = 'link'
      linkElement.innerText = link
      linkElement.setAttribute('href', link)
      linkElement.setAttribute('target', '_blank')
      linkElement.style.cursor = 'pointer'
      linkElement.style.color = '#4267b2'
      linkElement.style.display = 'block'
      content.appendChild(linkElement)
    })
  }

  dismissSnackbar() {
    this.showSnackbar = false
  }
}
</script>
<style scoped>
.v-card {
  border-radius: 15px;
}

.avatar {
  margin-left: 16px;
  margin-top: 16px;
}

.content {
  padding-block: 4px;
  margin-top: 8px;
  font-size: 22px;
  text-align: right;
}
#alert {
  margin-inline: 4px;
}

#name {
  margin: 0px;
  padding-block: 4px;
  justify-content: flex-end;
  font-weight: bold;
}
#username {
  margin: 0px;
  color: #4267b2;
  padding-block: 4px;
  text-align: right;
  font-weight: 600;
}
</style>