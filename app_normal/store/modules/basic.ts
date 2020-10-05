import {
  Mutation,
  Action,
  VuexModule,
  getModule,
  Module
} from 'vuex-module-decorators'
// import { IGame } from '../../../common/interfaces/IGame'
import store from '~/store/store'
import { IBasicState } from '~/store/types'
import { IUser } from '~/../common/interfaces/IUser'
import { INominate } from '~/../common/interfaces/INominate'
import { IRound } from '~/../common/interfaces/IRound'

@Module({ dynamic: true, store, name: 'basic', namespaced: true })
class Basic extends VuexModule implements IBasicState {
  user: IUser = { name: '', mail: '' }
  isPowerVoter: boolean = false
  votePoint: number = 1
  votedNominateId: number | null = null
  votedMultiNominateIds: { [key: string]: number } = {}
  nominates: INominate[] = []
  round: IRound = { isClosed: false, isPublished: false }

  @Mutation
  private SET_USER(val: IUser) {
    this.user = val
  }

  @Mutation
  private SET_IS_POWER_VOTER(val: boolean) {
    this.isPowerVoter = val
  }

  @Mutation
  private SET_VOTE_POINT(val: number) {
    this.votePoint = val
  }

  @Mutation
  private SET_VOTED_NOMINATE_ID(val: number | null) {
    this.votedNominateId = val
  }

  @Mutation
  private SET_VOTED_MULTI_NOMINATE_IDS(val: { [key: string]: number }) {
    this.votedMultiNominateIds = val
  }

  @Mutation
  private SET_NOMINATES(val: INominate[]) {
    this.nominates = val
  }

  @Mutation
  private SET_ROUND(val: IRound) {
    this.round = val
  }

  @Action({})
  public setUser(val: IUser) {
    this.SET_USER(val)
  }

  @Action({})
  public setIsPowerVoter(val: boolean) {
    this.SET_IS_POWER_VOTER(val)
  }

  @Action({})
  public setVotePoint(val: number) {
    this.SET_VOTE_POINT(val)
  }

  @Action({})
  public setVotedNominateId(val: number | null) {
    this.SET_VOTED_NOMINATE_ID(val)
  }

  @Action({})
  public setVotedMultiNominateIds(val: { [key: string]: number }) {
    this.SET_VOTED_MULTI_NOMINATE_IDS(val)
  }

  @Action({})
  public setNominates(val: INominate[]) {
    this.SET_NOMINATES(val)
  }

  @Action({})
  public setRound(val: IRound) {
    this.SET_ROUND(val)
  }
}

export const basicStateModule = getModule(Basic)
