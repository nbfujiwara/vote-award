<template>
  <div class="containerWithHeader">
    <page-header title-text="投票結果ローデータ"></page-header>

    <v-row class="ma-10" dense>
      <v-col v-for="(voteSummary, idx) in voteSummaries" :key="idx" cols="6">
        <v-card>
          <v-card-title>{{ voteSummary.nominate.name }}</v-card-title>
          <v-card-subtitle class="text-right">{{
            voteSummary.nominate.winner
          }}</v-card-subtitle>
          <v-card-text>
            {{ voteSummary.powerPoint }} + {{ voteSummary.normalPoint }} =
            {{ voteSummary.totalPoint }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-card class="ma-10">
      <v-card-title>Power投票者状況</v-card-title>
      <v-card-text>
        <v-simple-table dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-center">メール</th>
                <th class="text-center">ポイント</th>
                <th class="text-center">投票</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(powerVoter, i) in powerVoterDetails" :key="i">
                <td>
                  {{ powerVoter.base.mail }}
                </td>
                <td>
                  {{ powerVoter.base.point }}
                </td>
                <td>
                  <template v-if="powerVoter.vote">
                    {{ powerVoter.vote.nominate.id }} :
                    {{ powerVoter.vote.nominate.name }}
                  </template>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
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
export default class ResultSummaryPage extends ABasePage {
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
      .then(DataAccess.loadPowerVoters)
      .then(DataAccess.loadVoteSummary)
      .then(DataAccess.loadPowerVoterDetails)
  }
}
</script>

<style scoped lang="scss"></style>
