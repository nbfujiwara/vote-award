<template>
  <div class="containerWithHeader">
    <page-header title-text="HOME"></page-header>

    <v-card class="ma-10">
      <v-card-title>Round状態</v-card-title>

      <v-row>
        <v-col cols="2" class="text-right">
          <v-label>ステータス</v-label>
        </v-col>
        <v-col cols="10" class="text-left">
          <span v-if="!round.isPublished">ノミネート公開前</span>
          <span v-else-if="!round.isClosed">投票受付中</span>
          <span v-else>締め切り済</span>
        </v-col>
      </v-row>
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
export default class HomePage extends ABasePage {
  beforeMount() {
    this.commonBeforeMount()
  }

  get nominates(): INominate[] {
    return basicStateModule.nominates
  }

  get round(): IRound {
    return basicStateModule.round
  }

  mounted() {
    DataAccess.loadRound()
    DataAccess.loadNominates()
  }

}
</script>

<style scoped lang="scss">
</style>
