<template>
  <div class="containerWithHeader">
    <page-header title-text="Power投票者設定"></page-header>
    <v-card class="ma-10">
      <v-card-title>新規追加</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="8">
            <v-text-field
              v-model="inputMail"
              label="Mail"
              outlined
              placeholder="sample@nijibox.co.jp"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model.number="inputPoint"
              label="Point"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="executeAdd">Add</v-btn>
      </v-card-actions>
    </v-card>

    <v-card class="ma-10">
      <v-card-title>Power投票者</v-card-title>
      <v-card-text>
        <v-simple-table class="text-left">
          <template v-slot:default>
            <thead>
              <tr>
                <th>Doc ID</th>
                <th>メール</th>
                <th>ポイント</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(powerVoter, i) in powerVoters" :key="i">
                <td>{{ powerVoter.docId }}</td>
                <td>{{ powerVoter.mail }}</td>
                <td>{{ powerVoter.point }}</td>
                <td>
                  <v-btn
                    class="primary"
                    rounded
                    @click="showModifyDialog(powerVoter)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="isShowModifyDialog" max-width="500">
      <v-card>
        <v-card-title>編集</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="inputEditId"
            label="ID"
            outlined
            readonly
            disabled
          ></v-text-field>
          <v-text-field
            v-model="inputEditMail"
            label="Mail"
            outlined
          ></v-text-field>
          <v-text-field
            v-model.number="inputEditPoint"
            label="Point"
            outlined
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="executeModify">Update</v-btn>
          <v-btn color="error" @click="executeDelete"><v-icon>mdi-delete</v-icon></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IPowerVoter } from '../../common/interfaces/IPowerVoter'
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
export default class SettingPowerVotersPage extends ABasePage {
  private inputMail: string = ''
  private inputPoint: number = 10
  private isShowModifyDialog: boolean = false
  private inputEditId: string = ''
  private inputEditMail: string = ''
  private inputEditPoint: number = 10

  beforeMount() {
    this.commonBeforeMount()
  }

  get powerVoters(): IPowerVoter[] {
    return basicStateModule.powerVoters
  }

  mounted() {
    DataAccess.loadPowerVoters()
  }

  executeAdd() {
    DataAccess.addPowerVoter({
      mail: this.inputMail,
      point: this.inputPoint
    }).then(() => {
      this.inputMail = ''
    })
  }

  showModifyDialog(data: IPowerVoter) {
    if (data.docId) {
      this.inputEditId = data.docId
      this.inputEditMail = data.mail
      this.inputEditPoint = data.point
      this.isShowModifyDialog = true
    }
  }

  executeModify() {
    if (!this.inputEditId) {
      return
    }
    DataAccess.modifyPowerVoter(this.inputEditId, {
      mail: this.inputEditMail,
      point: this.inputEditPoint
    }).then(() => {
      this.isShowModifyDialog = false
    })
  }

  executeDelete() {
    DataAccess.deletePowerVoter(this.inputEditId).then(() => {
      this.isShowModifyDialog = false
    })
  }
}
</script>

<style scoped lang="scss"></style>
