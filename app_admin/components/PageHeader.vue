<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list class="text-left">
        <v-subheader>グローバルメニュー</v-subheader>
        <v-list-item to="/">
          <v-list-item-icon><v-icon>mdi-home</v-icon></v-list-item-icon>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-item to="/setting">
          <v-list-item-icon><v-icon>mdi-cog-outline</v-icon></v-list-item-icon>
          <v-list-item-title>設定</v-list-item-title>
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-icon><v-icon>mdi-logout</v-icon></v-list-item-icon>
          <v-list-item-title>ログアウト</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="titleText" />
      <v-spacer />
    </v-app-bar>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { basicStateModule } from '~/store/modules/basic'
import AppUtil from '~/plugins/AppUtil'

@Component({})
export default class PageHeader extends Vue {
  @Prop({
    type: String,
    required: true
  })
  public titleText: string = ''

  private clipped: boolean = false
  private drawer: boolean = false
  private miniVariant: boolean = false

  protected logout() {
    return AppUtil.logout().then(() => {
      this.$router.push({ path: '/login' })
    })
  }
}
</script>
