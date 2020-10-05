<template>
  <div class="containerWithHeader">
    <page-header title-text="投票結果ローデータ"></page-header>

    <v-chip
      v-show="voteChangeCount > 0"
      class="ma-2"
      color="primary"
      @click="loadVotes"
    >
      <v-avatar left class="accent">
        {{ voteChangeCount }}
      </v-avatar>
      投票集計差分
      <v-icon right>mdi-reload</v-icon>
    </v-chip>
    <v-chip
      v-show="voteChangeCount === 0"
      class="ma-2"
      color="green"
      text-color="white"
    >
      最新
    </v-chip>
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
                    <div
                      v-for="(dest, k) in powerVoter.vote.destList"
                      :key="`${i}_${k}`"
                    >
                      {{ dest.point }}pt : {{ dest.nominate.id }}:
                      {{ dest.nominate.name }}
                    </div>
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
export default class ResultSummaryWatchPage extends ABasePage {
  beforeMount() {
    this.commonBeforeMount()
  }

  private listener: Function | null = null

  get voteSummaries() {
    return basicStateModule.voteSummaries
  }

  get powerVoterDetails() {
    return basicStateModule.powerVoterDetails
  }

  get voteChangeCount() {
    return basicStateModule.voteChangeCount
  }

  mounted() {
    DataAccess.loadNominates()
      .then(DataAccess.loadPowerVoters)
      .then(DataAccess.loadInitializeVoteSummary)
      .then(DataAccess.loadInitializePowerVoterDetails)
      .then(() => {
        this.listener = DataAccess.watchVotes()
      })
  }

  beforeDestroy() {
    console.log('before Destroy called')
    if (this.listener) {
      this.listener()
    }
  }

  loadVotes() {
    basicStateModule.resetVoteChangeCount()
    DataAccess.loadAllVotes()
      .then(DataAccess.loadPowerVoterDetails)
      .then(DataAccess.loadVoteSummary)
  }
}
</script>

<style scoped lang="scss"></style>
