import {
  Mutation,
  Action,
  VuexModule,
  getModule,
  Module
} from 'vuex-module-decorators'
import store from '~/store/store'
import { IAdminUserState } from '~/store/types'
import { IAdminUser } from '~/../common/interfaces/IAdminUser'
import { IAdminUserRole } from '~/../common/interfaces/IAdminUserRole'

@Module({ dynamic: true, store, name: 'adminUser', namespaced: true })
class AdminUser extends VuexModule implements IAdminUserState {
  // state
  allAdminUsers: IAdminUser[] = []
  allAdminUserRoles: IAdminUserRole[] = []

  @Mutation
  private SET_ALL_ADMIN_USERS(val: IAdminUser[]) {
    this.allAdminUsers = val
  }

  @Mutation
  private SET_ALL_ADMIN_USER_ROLES(val: IAdminUserRole[]) {
    this.allAdminUserRoles = val
  }

  @Action({})
  public setAllAdminUsers(val: IAdminUser[]) {
    this.SET_ALL_ADMIN_USERS(val)
  }

  @Action({})
  public setAllAdminUserRoles(val: IAdminUserRole[]) {
    this.SET_ALL_ADMIN_USER_ROLES(val)
  }
}
export const adminUserStateModule = getModule(AdminUser)
