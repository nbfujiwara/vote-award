import {IUser} from "./IUser"
import {INominate} from "./INominate"

export interface IVoteDetail {
  user: IUser
  isPowerVoter: boolean
  destList: { nominate:INominate, point: number }[]
}
