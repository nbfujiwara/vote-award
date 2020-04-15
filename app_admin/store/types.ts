import { IPowerVoter } from '../../common/interfaces/IPowerVoter'
import { INominate } from '~/../common/interfaces/INominate'
import { IRound } from '~/../common/interfaces/IRound'

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
}
