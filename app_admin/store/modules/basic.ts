import {
  Mutation,
  Action,
  VuexModule,
  getModule,
  Module
} from 'vuex-module-decorators'
import { IPowerVoter } from '../../../common/interfaces/IPowerVoter'
import store from '~/store/store'
import { IBasicState } from '~/store/types'
import { INominate } from '~/../common/interfaces/INominate'
import { IRound } from '~/../common/interfaces/IRound'

@Module({ dynamic: true, store, name: 'basic', namespaced: true })
class Basic extends VuexModule implements IBasicState {
  nominates: INominate[] = []
  powerVoters: IPowerVoter[] = []
  round: IRound = { isClosed: false, isPublished: false }

  @Mutation
  private SET_NOMINATES(val: INominate[]) {
    this.nominates = val
  }

  @Mutation
  private SET_POWER_VOTERS(val: IPowerVoter[]) {
    this.powerVoters = val
  }

  @Mutation
  private SET_ROUND(val: IRound) {
    this.round = val
  }

  @Action({})
  public setNominates(val: INominate[]) {
    this.SET_NOMINATES(val)
  }

  @Action({})
  public setPowerVoters(val: IPowerVoter[]) {
    this.SET_POWER_VOTERS(val)
  }

  @Action({})
  public setRound(val: IRound) {
    this.SET_ROUND(val)
  }
}

export const basicStateModule = getModule(Basic)
