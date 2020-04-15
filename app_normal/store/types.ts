import { INominate } from '~/../common/interfaces/INominate'
import { IRound } from '~/../common/interfaces/IRound'
import { IUser } from '~/../common/interfaces/IUser'

export interface IRootState {
  general: IGeneralState
  basic: IBasicState
}

export interface IGeneralState {
  isAuthorized: boolean
  toastMessage: string
  toastNo: number
}

export interface IBasicState {
  user: IUser
  votedNominateId: number | null
  nominates: INominate[]
  round: IRound
}
