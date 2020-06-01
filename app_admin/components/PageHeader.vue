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
        <v-list-item to="/result">
          <v-list-item-icon><v-icon>mdi-vote</v-icon></v-list-item-icon>
          <v-list-item-title>公開用投票結果</v-list-item-title>
        </v-list-item>
        <v-list-item to="/result_chart">
          <v-list-item-icon><v-icon>mdi-chart-bar</v-icon></v-list-item-icon>
          <v-list-item-title>結果グラフ</v-list-item-title>
        </v-list-item>
        <v-list-item to="/result_summary">
          <v-list-item-icon><v-icon>mdi-vote-outline</v-icon></v-list-item-icon>
          <v-list-item-title>結果サマリ(静的)</v-list-item-title>
        </v-list-item>
        <v-list-item to="/result_summary_watch">
          <v-list-item-icon><v-icon>mdi-vote-outline</v-icon></v-list-item-icon>
          <v-list-item-title>結果サマリ(Watch)</v-list-item-title>
        </v-list-item>
        <v-list-item to="/result_raw">
          <v-list-item-icon><v-icon>mdi-view-list</v-icon></v-list-item-icon>
          <v-list-item-title>結果ローデータ</v-list-item-title>
        </v-list-item>
        <v-list-item to="/setting">
          <v-list-item-icon><v-icon>mdi-cog-outline</v-icon></v-list-item-icon>
          <v-list-item-title>設定</v-list-item-title>
        </v-list-item>
        <v-list-item to="/setting_power_voters">
          <v-list-item-icon><v-icon>mdi-cog-outline</v-icon></v-list-item-icon>
          <v-list-item-title>Power投票者設定</v-list-item-title>
        </v-list-item>
        <v-list-item to="/setting_admin_users">
          <v-list-item-icon><v-icon>mdi-account-cog</v-icon></v-list-item-icon>
          <v-list-item-title>管理者設定</v-list-item-title>
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
  public titleText: string | undefined

  private clipped: boolean = false
  private drawer: boolean = true
  private miniVariant: boolean = false

  protected logout() {
    return AppUtil.logout().then(() => {
      this.$router.push({ path: '/login' })
    })
  }
}
</script>
