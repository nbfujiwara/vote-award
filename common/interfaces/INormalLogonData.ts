import {IVote} from "./IVote"
import {IRound} from "./IRound"

export interface INormalLogonData {
  vote: IVote
  votePoint: number
  isPowerUser: boolean
  round: IRound
}
