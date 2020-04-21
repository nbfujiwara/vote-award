import {
  Mutation,
  Action,
  VuexModule,
  getModule,
  Module
} from 'vuex-module-decorators'
import store from '~/store/store'
import { IBasicState } from '~/store/types'
import { INominate } from '~/../common/interfaces/INominate'
import { IRound } from '~/../common/interfaces/IRound'
import { IVoteDetail } from '~/../common/interfaces/IVoteDetail'
import { IVoteSummary } from '~/../common/interfaces/IVoteSummary'
import { IPowerVoter } from '~/../common/interfaces/IPowerVoter'
import { IPowerVoterDetail } from '~/../common/interfaces/IPowerVoterDetail'

@Module({ dynamic: true, store, name: 'basic', namespaced: true })
class Basic extends VuexModule implements IBasicState {
  nominates: INominate[] = []
  powerVoters: IPowerVoter[] = []
  powerVoterDetails: IPowerVoterDetail[] = []
  round: IRound = { isClosed: false, isPublished: false }
  votes: IVoteDetail[] = []
  voteSummaries: IVoteSummary[] = []
  voteChangeCount: number = 0

  @Mutation
  private SET_NOMINATES(val: INominate[]) {
    this.nominates = val
  }

  @Mutation
  private SET_POWER_VOTERS(val: IPowerVoter[]) {
    this.powerVoters = val
  }

  @Mutation
  private SET_POWER_VOTER_DETAILS(val: IPowerVoterDetail[]) {
    this.powerVoterDetails = val
  }

  @Mutation
  private SET_ROUND(val: IRound) {
    this.round = val
  }

  @Mutation
  private SET_VOTES(val: IVoteDetail[]) {
    this.votes = val
  }

  @Mutation
  private SET_VOTE_SUMMARIES(val: IVoteSummary[]) {
    this.voteSummaries = val
  }

  @Mutation
  private ADD_VOTE_CHANGE_COUNT() {
    this.voteChangeCount++
  }

  @Mutation
  private RESET_VOTE_CHANGE_COUNT() {
    this.voteChangeCount = 0
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
  public setPowerVoterDetails(val: IPowerVoterDetail[]) {
    this.SET_POWER_VOTER_DETAILS(val)
  }

  @Action({})
  public setRound(val: IRound) {
    this.SET_ROUND(val)
  }

  @Action({})
  public setVotes(val: IVoteDetail[]) {
    this.SET_VOTES(val)
  }

  @Action({})
  public setVoteSummaries(val: IVoteSummary[]) {
    this.SET_VOTE_SUMMARIES(val)
  }

  @Action({})
  public addVoteChangeCount() {
    this.ADD_VOTE_CHANGE_COUNT()
  }

  @Action({})
  public resetVoteChangeCount() {
    this.RESET_VOTE_CHANGE_COUNT()
  }
}

export const basicStateModule = getModule(Basic)
