<template>
  <div class="containerWithHeader">
    <page-header title-text="投票結果ローデータ"></page-header>

    <v-data-table
      :headers="tableHeaders"
      :items="tableItems"
      class="text-left"
      dense
    ></v-data-table>
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
export default class ResultRawPage extends ABasePage {
  beforeMount() {
    this.commonBeforeMount()
  }

  private tableHeaders: { [s: string]: any }[] = [
    {
      text: 'メール',
      value: 'mail',
      sortable: false
    },
    {
      text: '名前',
      value: 'name',
      align: 'start'
    },
    {
      text: '投票',
      value: 'nominate'
    }
  ]

  private tableItems: { [s: string]: any }[] = []

  mounted() {
    DataAccess.loadAllVotes().then(() => {
      this.refreshTableItems()
    })
  }

  refreshTableItems() {
    this.tableItems.splice(0, this.tableItems.length)
    for (const vote of basicStateModule.votes) {
      let nominateName: string = ''
      if (vote.nominate) {
        nominateName = vote.nominate.id + ':' + vote.nominate.name
      }

      this.tableItems.push({
        name: vote.user.name,
        mail: vote.user.mail,
        nominate: nominateName
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
