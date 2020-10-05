<template>
  <div class="containerWithHeader">
    <page-header title-text="投票結果"></page-header>

    <v-card v-show="isShowBest" class="ma-10">
      <v-card-text>
        <p>MVP</p>
        <p>{{ bestNominateName }}</p>
        <p>{{ bestNominateWinner }}</p>
        <p>
          得票数:<span>{{ bestPoint }}</span
          ><span>(有効投票数 : {{ totalSummaryPoint }} 中)</span>
        </p>
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
export default class ResultPage extends ABasePage {
  beforeMount() {
    this.commonBeforeMount()
  }

  private bestNominateName: string = ''
  private bestNominateWinner: string = ''
  private bestPoint: number = 0
  private totalSummaryPoint: number = 0
  private isShowBest: boolean = false

  mounted() {
    DataAccess.loadNominates()
      .then(DataAccess.loadAllVotes)
      .then(DataAccess.loadVoteSummary)
      .then(this.showBestInfo)
  }

  private showBestInfo() {
    this.isShowBest = false
    let maxPoint: number = 0
    this.totalSummaryPoint = 0
    for (const voteSum of basicStateModule.voteSummaries) {
      this.totalSummaryPoint += voteSum.totalPoint
      if (maxPoint < voteSum.totalPoint) {
        maxPoint = voteSum.totalPoint
        this.bestNominateName = voteSum.nominate.name
        this.bestNominateWinner = voteSum.nominate.winner
        this.bestPoint = voteSum.totalPoint
      }
    }
    this.isShowBest = true
  }
}
</script>

<style scoped lang="scss"></style>
