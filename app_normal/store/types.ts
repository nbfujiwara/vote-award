import { INominate } from '~/../common/interfaces/INominate'
// import { IGame } from '~/../common/interfaces/IGame'
import { IUser } from '~/../common/interfaces/IUser'

export interface IRootState {
  general: IGeneralState
  basic: IBasicState
}

export interface IGeneralState {
  isAuthorized: boolean
  isRegistered: boolean
  toastMessage: string
  toastNo: number
}

export interface IBasicState {
  user: IUser
  votedNominateId: number | null
  nominates: INominate[]
  //  sheetCells: IBingoCell[][]
  //  game: IGame
}
