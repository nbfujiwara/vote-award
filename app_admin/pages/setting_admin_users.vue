<template>
  <div class="containerWithHeader">
    <page-header title-text="管理者設定"></page-header>
    <v-row dense>
      <v-col cols="6">
        <v-card class="ma-5">
          <v-card-title>申請者</v-card-title>
          <v-list two-line subheader class="text-left">
            <v-list-item
              v-for="(user, i) in waitingAdminUsers"
              :key="'waiting' + { i }"
            >
              <v-list-item-content>
                <v-list-item-title
                  >{{ user.name }} ({{ user.mail }})
                </v-list-item-title>
                <v-list-item-subtitle>{{ user.userId }}</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn @click="executeAdd(user.userId)">Add</v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card class="ma-5">
          <v-card-title>管理者</v-card-title>
          <v-list two-line subheader class="text-left">
            <v-list-item
              v-for="(user, i) in hasRoleAdminUsers"
              :key="'hasRole' + { i }"
            >
              <v-list-item-content>
                <v-list-item-title
                  >{{ user.name }} ({{ user.mail }})
                </v-list-item-title>
                <v-list-item-subtitle>{{ user.userId }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn @click="executeDelete(user.userId)">Delete</v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IPowerVoter } from '../../common/interfaces/IPowerVoter'
import { IAdminUser } from '../../common/interfaces/IAdminUser'
import { INominate } from '~/../common/interfaces/INominate'
import { IRound } from '~/../common/interfaces/IRound'
import { adminUserStateModule } from '~/store/modules/adminUser'
import AppUtil from '~/plugins/AppUtil'
import ABasePage from '~/plugins/ABasePage'
import DataAccess from '~/plugins/DataAccess'

@Component({
  components: {
    PageHeader: () => import('~/components/PageHeader.vue')
  }
})
export default class SettingAdminUsersPage extends ABasePage {
  beforeMount() {
    this.commonBeforeMount()
  }

  private waitingAdminUsers: IAdminUser[] = []
  private hasRoleAdminUsers: IAdminUser[] = []

  private divideAdminUsers() {
    this.waitingAdminUsers = []
    this.hasRoleAdminUsers = []

    for (const au of adminUserStateModule.allAdminUsers) {
      let hasRole: boolean = false
      for (const roleObj of adminUserStateModule.allAdminUserRoles) {
        if (roleObj.userId === au.userId && roleObj.role > 0) {
          hasRole = true
        }
      }
      if (hasRole) {
        this.hasRoleAdminUsers.push(au)
      } else {
        this.waitingAdminUsers.push(au)
      }
    }
  }

  mounted() {
    DataAccess.loadAllAdminUsers()
      .then(DataAccess.loadAllAdminUserRoles)
      .then(this.divideAdminUsers)
  }

  executeAdd(userId: string) {
    DataAccess.addAdminUserRole(userId).then(this.divideAdminUsers)
  }

  executeDelete(userId: string) {
    DataAccess.deleteAdminUserRole(userId).then(this.divideAdminUsers)
  }
}
</script>

<style scoped lang="scss"></style>
