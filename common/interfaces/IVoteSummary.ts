import {IUser} from "./IUser"
import {INominate} from "./INominate"

export interface IVoteSummary {
  nominate: INominate
  normalPoint: number
  powerPoint: number
  totalPoint: number
}
