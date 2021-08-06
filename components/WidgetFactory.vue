<template>
  <v-container class="searchContainer">
    <NotificationWidget v-if="notification" :notificationTopic="model" />
    <CountryWidget v-else-if="country" :country="model" />
    <SourceWidget v-else-if="source" :source="model" />
    <UserWidget v-else-if="user" :user="model" />
    <NewsWidget v-else-if="news" :news="model" />
  </v-container>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import NotificationWidget from '~/components/notifications/NotificationWidget.vue'
import CountryWidget from '~/components/countries/CountryWidget.vue'
import SourceWidget from '~/components/sources/SourceWidget.vue'
import UserWidget from '~/components/users/UserWidget.vue'
import NewsWidget from '~/components/news/NewsWidget.vue'
import Model from '~/lib/models/model'

@Component({
  components: {
    NotificationWidget,
    CountryWidget,
    SourceWidget,
    NewsWidget,
    UserWidget,
  },
})
export default class WidgetFactory extends Vue {
  @Prop() model?: Model

  get routeName(): string {
    return this.$router.currentRoute.name?.replace('dashboard-', '') ?? ''
  }

  get source() {
    if (this.routeName == 'sources') {
      return true
    } else {
      return false
    }
  }
  get user() {
    if (this.routeName == 'users') {
      return true
    } else {
      return false
    }
  }
  get country() {
    if (this.routeName == 'countries') {
      return true
    } else {
      return false
    }
  }
  get news() {
    if (this.routeName == 'news') {
      return true
    } else {
      return false
    }
  }
  get notification() {
    if (this.routeName == 'notification') {
      return true
    } else {
      return false
    }
  }
}
</script>


<style scoped>
.searchContainer {
  display: flex;
  justify-content: center;
}
</style>