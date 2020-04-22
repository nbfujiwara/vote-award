import { IVote } from '../../common/interfaces/IVote'
import { IRound } from '../../common/interfaces/IRound'
import AppUtil from './AppUtil'
import { basicStateModule } from '~/store/modules/basic'
import { generalStateModule } from '~/store/modules/general'
import { INominate } from '~/../common/interfaces/INominate'

/**
 * データの取得や送信
 */
export default class DataAccess {
  public static ROUND_ID: string = '1'

  public static loadNominates() {
    return AppUtil.FBMng.getNominates().then((list: INominate[]) => {
      basicStateModule.setNominates(list)
    })
  }

  public static vote(nominateId: number) {
    const vote: IVote = {
      user: basicStateModule.user,
      nominateId
    }

    AppUtil.FBMng.saveVote(vote).then(() => {
      basicStateModule.setVotedNominateId(nominateId)
    })
  }

  public static watchRoundChanges() {
    const listener = AppUtil.FBMng.watchRound(
      DataAccess.ROUND_ID,
      (data: IRound) => {
        basicStateModule.setRound(data)
      }
    )
  }
}
