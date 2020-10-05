<template>
  <div class="containerWithHeader">
    <page-header title-text="投票結果グラフ"></page-header>

    <v-card class="ma-5">
      <v-card-text>
        <div id="chart"></div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import * as c3 from 'c3'
import { PrimitiveArray } from 'c3'
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
export default class ResultChartPage extends ABasePage {
  chart: c3.ChartAPI | null = null

  beforeMount() {
    this.commonBeforeMount()
  }

  get voteSummaries() {
    return basicStateModule.voteSummaries
  }

  get powerVoterDetails() {
    return basicStateModule.powerVoterDetails
  }

  mounted() {
    DataAccess.loadNominates()
      .then(DataAccess.loadAllVotes)
      .then(DataAccess.loadVoteSummary)
      .then(DataAccess.loadPowerVoterDetails)
      .then(() => {
        this.initChart()
        this.drawGraphData()
      })
  }

  initChart(): void {
    this.chart = c3.generate({
      bindto: '#chart',
      data: {
        type: 'bar',
        x: 'x',
        columns: [],
        groups: [['Power', 'Normal']]
      },
      axis: {
        x: {
          type: 'category' // X軸が文字列の場合はこれを指定
        },
        rotated: true
      }
    })
  }

  drawGraphData(): void {
    if (!this.chart) {
      return
    }

    const powerData: PrimitiveArray = ['Power']
    const normalData: PrimitiveArray = ['Normal']

    const columnsData: Array<[string, ...PrimitiveArray]> = [
      ['x'],
      ['Power'],
      ['Normal']
    ]
    for (const voteSum of basicStateModule.voteSummaries) {
      columnsData[0].push(voteSum.nominate.id + ':' + voteSum.nominate.name)
      columnsData[1].push(voteSum.powerPoint)
      columnsData[2].push(voteSum.normalPoint)
    }
    this.chart.load({
      columns: columnsData
    })
  }
}
</script>

<style scoped lang="scss"></style>
