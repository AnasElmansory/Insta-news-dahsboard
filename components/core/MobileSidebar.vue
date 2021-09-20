<template>
  <v-navigation-drawer v-model="showSidebar" fixed dark>
    <b-avatar :src="user.avatar" size="3rem" variant="success" class="avatar">
    </b-avatar>
    <v-list id="lists" nav>
      <v-list-item>
        <span>
          {{ user.name }}
        </span>
      </v-list-item>
      <v-list-item>
        <span>
          {{ user.email }}
        </span>
      </v-list-item>
    </v-list>

    <v-list id="lists" nav>
      <v-list-item
        class="listItem"
        selectable
        v-for="(item, index) in sidebarItems"
        :key="index"
        :to="'/dashboard/' + item"
      >
        <span>
          {{ item }}
        </span>
      </v-list-item>
    </v-list>

    <v-row id="signOutBtn" justify="center">
      <v-btn text @click="signOut">
        <v-icon left light>mdi-logout</v-icon>
        Sign Out
      </v-btn>
    </v-row>
  </v-navigation-drawer>
</template>

<script lang='ts'>
import { Vue, Component, VModel } from 'nuxt-property-decorator'
import getAdminUser from '~/lib/auth'
@Component({})
export default class Sidebar extends Vue {
  @VModel({ default: false }) showSidebar!: boolean
  sidebarItems: string[] = [
    'Sources',
    'Users',
    'News',
    'Countries',
    'Notification',
  ]

  get user() {
    return this.$store.getters.userInfo
  }

  async mounted() {
    this.google.then(async (auth) => {
      if (auth.isSignedIn.get()) {
        const user = auth.currentUser.get()
        if (user) {
          const adminOr = await getAdminUser(
            user.getId(),
            user.getAuthResponse().access_token,
            this.$axios
          )
          if (adminOr === false) {
            return this.$router.replace('/sign')
          } else {
            this.$store.commit('signIn', adminOr)
            return
          }
        }
      } else {
        return this.$router.replace('/sign')
      }
    })
  }

  signOut() {
    this.google.signOut()

    this.$store.commit('signOut')
    return this.$router.replace('/sign')
  }
}
</script>

<style scoped>
#nav-bar {
  user-select: none;
}

.sidebox {
  padding: 0px;
  flex-grow: 1;
  display: flex;
  height: 100%;
  flex-direction: column;
}
.avatar {
  background-color: rgb(37, 37, 37);
  margin: 6px;
  margin-top: 20px;
  user-select: none;
}

#signOutBtn {
  margin-top: 8px;
}

#lists {
  text-overflow: ellipsis;
}

.listItem {
  justify-content: center;
  text-decoration: none;
  text-overflow: ellipsis;
  flex: 1 1 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.userInfo {
  height: 30%;
  padding: 8px;
  display: flex;
  flex-direction: column;
}
span {
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>



