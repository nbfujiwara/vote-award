import { IPowerVoter } from '../../common/interfaces/IPowerVoter'
import { INominate } from '~/../common/interfaces/INominate'
import { IRound } from '~/../common/interfaces/IRound'
import { IVoteDetail } from '~/../common/interfaces/IVoteDetail'
import { IVoteSummary } from '~/../common/interfaces/IVoteSummary'
import { IPowerVoterDetail } from '~/../common/interfaces/IPowerVoterDetail'
import { IAdminUser } from '~/../common/interfaces/IAdminUser'
import { IAdminUserRole } from '~/../common/interfaces/IAdminUserRole'

export interface IRootState {
  general: IGeneralState
  basic: IBasicState
}

export interface IGeneralState {
  isAuthorized: boolean
  hasRole: boolean
  toastMessage: string
  toastNo: number
}

export interface IBasicState {
  nominates: INominate[]
  round: IRound
  powerVoters: IPowerVoter[]
  powerVoterDetails: IPowerVoterDetail[]
  votes: IVoteDetail[]
  voteSummaries: IVoteSummary[]
  voteChangeCount: number
}

export interface IAdminUserState {
  allAdminUsers: IAdminUser[]
  allAdminUserRoles: IAdminUserRole[]
}
