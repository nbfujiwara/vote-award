import {IUser} from "./IUser"
import {INominate} from "./INominate"

export interface IVoteDetail {
  user: IUser
  nominate: INominate | null
}
