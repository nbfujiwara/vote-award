import {IVoteDetail} from "./IVoteDetail"
import {IPowerVoter} from "./IPowerVoter"

export interface IPowerVoterDetail {
  base: IPowerVoter
  vote?: IVoteDetail
}
