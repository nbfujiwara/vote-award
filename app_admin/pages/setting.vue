<template>
  <div class="containerWithHeader">
    <page-header title-text="設定"></page-header>

    <v-card class="ma-10">
      <v-card-title>Round状態</v-card-title>
      <v-card-text>
        <div>
          <v-btn class="primary" @click="togglePublished"
            >ノミネート:公開/非公開　切り替え</v-btn
          >
          <v-btn class="primary" @click="toggleClosed"
            >投票:受付/締切り　切り替え</v-btn
          >
        </div>

        <v-row>
          <v-col cols="2" class="text-right">
            <v-label>ノミネート公開:</v-label>
          </v-col>
          <v-col cols="10" class="text-left">
            <span v-if="round.isPublished">公開！</span>
            <span v-else>非公開</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2" class="text-right">
            <v-label>投票受付:</v-label>
          </v-col>
          <v-col cols="10" class="text-left">
            <span v-if="round.isClosed">締め切り</span>
            <span v-else>可能</span>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { INominate } from '~/../common/interfaces/INominate'
import { IRound } from '~/../common/interfaces/IRound'
import { basicStateModule } from '~/store/modules/basic'
import AppUtil from '~/plugins/AppUtil'
import ABasePage from '~/plugins/ABasePage'
import DataAccess from '~/plugins/DataAccess'

@Component({
  components: {
    PageHeader: () => import('~/components/PageHeader.vue')
  }
})
export default class SettingPage extends ABasePage {
  beforeMount() {
    this.commonBeforeMount()
  }

  get round(): IRound {
    return basicStateModule.round
  }

  mounted() {
    DataAccess.loadNominates()
  }

  togglePublished() {
    const round = basicStateModule.round
    round.isPublished = !round.isPublished
    DataAccess.saveRound(round)
  }

  toggleClosed() {
    const round = basicStateModule.round
    round.isClosed = !round.isClosed
    DataAccess.saveRound(round)
  }
}
</script>

<style scoped lang="scss"></style>
