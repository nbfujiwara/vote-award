<template>
  <div class="myContainer">
    <div class="text-right mb-5">
      <v-icon @click="logout">mdi-logout</v-icon>
    </div>

    <template v-if="!isPublished">
      <v-alert type="info">アワードノミネートは未公開中です</v-alert>
    </template>
    <template v-else>
      <v-alert v-if="!isClosed && !votedNominateId" type="info"
        >投票したい候補をタップしてください</v-alert
      >
      <v-alert v-if="!isClosed && votedNominateId" type="success"
        >投票を受け付けました。締め切りまでは変更可能です</v-alert
      >
      <v-alert v-if="isClosed" color="blue-grey" dark
        >投票は締め切りました</v-alert
      >

      <v-row>
        <v-col v-for="(nominate, idx) in nominates" :key="idx" cols="6">
          <v-card @click="executeVote(nominate.id)">
            <v-card-title>{{ nominate.name }}</v-card-title>
            <v-card-subtitle class="text-right">{{
              nominate.winner
            }}</v-card-subtitle>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-icon x-large :color="colorName(nominate.id)">mdi-heart</v-icon>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>
    <v-divider></v-divider>

    <v-card class="ma-10">
      <v-list dense>
        <v-subheader>審査基準</v-subheader>
        <v-list-item-group color="primary">
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-check</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              役割範囲を大きく超えた取り組み
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-check</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              まじめに期待に応え続けることで創出した、社外・社内への好影響
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-check</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              柔軟に変わり続ける動きによる社外・社内への好影響
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-check</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              前例のない取り組みによるイノベーション創出
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-check</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              その他、ニジボックスの一員としての高い事業貢献
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { INominate } from '~/../common/interfaces/INominate'
import { basicStateModule } from '~/store/modules/basic'
import AppUtil from '~/plugins/AppUtil'
import ABasePage from '~/plugins/ABasePage'
import DataAccess from '~/plugins/DataAccess'

@Component({})
export default class MainPage extends ABasePage {
  beforeMount() {
    this.commonBeforeMount()
  }

  get nominates(): INominate[] {
    return basicStateModule.nominates
  }

  get votedNominateId(): number | null {
    return basicStateModule.votedNominateId
  }

  get isClosed(): boolean {
    return false
  }

  get isPublished(): boolean {
    return true
  }

  colorName(id: number): string {
    if (basicStateModule.votedNominateId === id) {
      return 'pink'
    }
    return ''
  }

  mounted() {
    DataAccess.loadNominates()
  }

  executeVote(nominateId: number) {
    DataAccess.vote(nominateId)
  }

  protected logout() {
    return AppUtil.logout().then(() => {
      this.$router.push({ path: '/login' })
    })
  }
}
</script>

<style scoped lang="scss">
.myContainer {
  margin: 0 auto;
  width: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
