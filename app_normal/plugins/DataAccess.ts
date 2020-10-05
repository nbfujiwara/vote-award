import Vue from 'vue'
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
  public static ROUND_ID: string = '102'

  public static loadNominates() {
    return AppUtil.FBMng.getNominates(DataAccess.ROUND_ID).then(
      (list: INominate[]) => {
        basicStateModule.setNominates(list)
      }
    )
  }

  public static increaseVote(nominateId: number) {
    const data = basicStateModule.votedMultiNominateIds

    let votedCount: number = 0
    for (const [id, count] of Object.entries(data)) {
      votedCount += count
    }

    if (votedCount >= basicStateModule.votePoint) {
      return
    }

    if (data.hasOwnProperty(nominateId)) {
      data[nominateId]++
    } else {
      Vue.set(data, nominateId, 1)
    }
    DataAccess.saveMultiVote(data)
  }

  public static decreaseVote(nominateId: number) {
    const data = basicStateModule.votedMultiNominateIds

    if (!data.hasOwnProperty(nominateId)) {
      return
    }
    if (!data[nominateId]) {
      return
    }

    data[nominateId]--
    DataAccess.saveMultiVote(data)
  }

  private static saveMultiVote(multiVote: { [key: string]: number }) {
    const vote: IVote = {
      user: basicStateModule.user,
      multiVote,
      nominateId: null
    }
    AppUtil.FBMng.saveVote(DataAccess.ROUND_ID, vote).then(() => {
      basicStateModule.setVotedMultiNominateIds(multiVote)
    })
  }

  public static vote(nominateId: number) {
    const vote: IVote = {
      user: basicStateModule.user,
      multiVote: {},
      nominateId
    }
    AppUtil.FBMng.saveVote(DataAccess.ROUND_ID, vote).then(() => {
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
