import {IUser} from "./IUser"
import {INominate} from "./INominate"

export interface IVoteSummary {
  nominate: INominate
  normalCount: number
  powerCount: number
  normalPoint: number
  powerPoint: number
  totalPoint: number
}
