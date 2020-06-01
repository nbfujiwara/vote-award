import AppUtil from './AppUtil'
import { IVote } from '~/../common/interfaces/IVote'
import { IVoteDetail } from '~/../common/interfaces/IVoteDetail'
import { IVoteSummary } from '~/../common/interfaces/IVoteSummary'
import { IPowerVoter } from '~/../common/interfaces/IPowerVoter'
import { IPowerVoterDetail } from '~/../common/interfaces/IPowerVoterDetail'
import { IAdminUser } from '~/../common/interfaces/IAdminUser'
import { IAdminUserRole } from '~/../common/interfaces/IAdminUserRole'
import { basicStateModule } from '~/store/modules/basic'
import { generalStateModule } from '~/store/modules/general'
import { adminUserStateModule } from '~/store/modules/adminUser'
import { INominate } from '~/../common/interfaces/INominate'
import { IRound } from '~/../common/interfaces/IRound'

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

  public static loadRound() {
    return AppUtil.FBMng.getRound(DataAccess.ROUND_ID).then((round) => {
      if (round) {
        basicStateModule.setRound(round)
      }
    })
  }

  public static saveRound(round: IRound) {
    return AppUtil.FBMng.saveRound(DataAccess.ROUND_ID, round).then(() => {
      return DataAccess.loadRound()
    })
  }

  public static loadAllVotes() {
    return AppUtil.FBMng.getVotes().then((rowset: IVote[]) => {
      const list: IVoteDetail[] = []
      for (const row of rowset) {
        const detail: IVoteDetail = {
          user: row.user,
          nominate: DataAccess.getNominate(row.nominateId)
        }
        list.push(detail)
      }
      basicStateModule.setVotes(list)
    })
  }

  public static loadPowerVoters() {
    return AppUtil.FBMng.getPowerVoters().then((list: IPowerVoter[]) => {
      basicStateModule.setPowerVoters(list)
    })
  }

  public static loadVoteSummary() {
    const powerVoterPointHash: { [k: string]: number } = {}
    for (const pv of basicStateModule.powerVoters) {
      powerVoterPointHash[pv.mail] = pv.point
    }

    return new Promise((resolve, reject) => {
      const voteSummaries: IVoteSummary[] = []
      const idIndexMap: { [k: number]: number } = {}
      for (const [idx, nominate] of basicStateModule.nominates.entries()) {
        voteSummaries.push({
          nominate,
          normalCount: 0,
          powerCount: 0,
          normalPoint: 0,
          powerPoint: 0,
          totalPoint: 0
        })
        idIndexMap[nominate.id] = idx
      }

      for (const vote of basicStateModule.votes) {
        if (vote.nominate) {
          const idx: number = idIndexMap[vote.nominate.id]

          if (powerVoterPointHash.hasOwnProperty(vote.user.mail)) {
            const pt = powerVoterPointHash[vote.user.mail]
            voteSummaries[idx].powerCount++
            voteSummaries[idx].powerPoint += pt
            voteSummaries[idx].totalPoint += pt
          } else {
            voteSummaries[idx].normalCount++
            voteSummaries[idx].normalPoint++
            voteSummaries[idx].totalPoint++
          }
        }
      }
      basicStateModule.setVoteSummaries(voteSummaries)
      resolve()
    })
  }

  public static loadPowerVoterDetails() {
    return new Promise((resolve, reject) => {
      const list: IPowerVoterDetail[] = []
      const mailIndexMap: { [k: string]: number } = {}
      for (const [idx, row] of basicStateModule.powerVoters.entries()) {
        list.push({
          base: row
        })
        mailIndexMap[row.mail] = idx
      }

      for (const vote of basicStateModule.votes) {
        if (vote.nominate && mailIndexMap.hasOwnProperty(vote.user.mail)) {
          const idx: number = mailIndexMap[vote.user.mail]
          list[idx].vote = vote
        }
      }

      basicStateModule.setPowerVoterDetails(list)
      resolve()
    })
  }

  private static getNominate(id: number | null): INominate | null {
    for (const obj of basicStateModule.nominates) {
      if (obj.id === id) {
        return obj
      }
    }
    return null
  }

  public static loadInitializeVoteSummary() {
    return new Promise((resolve, reject) => {
      const voteSummaries: IVoteSummary[] = []
      for (const [idx, nominate] of basicStateModule.nominates.entries()) {
        voteSummaries.push({
          nominate,
          normalCount: 0,
          powerCount: 0,
          normalPoint: 0,
          powerPoint: 0,
          totalPoint: 0
        })
      }
      basicStateModule.setVoteSummaries(voteSummaries)
      resolve()
    })
  }

  public static loadInitializePowerVoterDetails() {
    return new Promise((resolve, reject) => {
      const list: IPowerVoterDetail[] = []
      for (const [idx, row] of basicStateModule.powerVoters.entries()) {
        list.push({
          base: row
        })
      }
      basicStateModule.setPowerVoterDetails(list)
      resolve()
    })
  }

  /**
   * votesの変化を検知し適切にstoreを更新する
   *
   * 変更検知で差分をビシバシ描画を走らせようと思ったものの
   * 集計によるサマリの減算の扱いのため、結局変更検知ごとに全件取得しないといけない感じになっちゃったので
   * カウンターだけの処理にした
   */
  public static watchVotes() {
    basicStateModule.resetVoteChangeCount()
    return AppUtil.FBMng.watchVotes((changeType: string, vote: IVote) => {
      basicStateModule.addVoteChangeCount()
    })
  }

  public static addPowerVoter(data: IPowerVoter) {
    return AppUtil.FBMng.saveAddPowerVoter(data)
      .then(DataAccess.loadPowerVoters)
      .then(() => {
        generalStateModule.setToastMessage(
          data.mail + 'をPower投票者として追加しました'
        )
      })
  }

  public static modifyPowerVoter(docId: string, data: IPowerVoter) {
    return AppUtil.FBMng.saveModifyPowerVoter(docId, data)
      .then(DataAccess.loadPowerVoters)
      .then(() => {
        generalStateModule.setToastMessage('更新しました')
      })
  }

  public static deletePowerVoter(docId: string) {
    return AppUtil.FBMng.deletePowerVoter(docId)
      .then(DataAccess.loadPowerVoters)
      .then(() => {
        generalStateModule.setToastMessage('削除しました')
      })
  }

  public static loadAllAdminUsers() {
    return AppUtil.FBMng.getAllAdminUsers().then((list: IAdminUser[]) => {
      adminUserStateModule.setAllAdminUsers(list)
    })
  }

  public static loadAllAdminUserRoles() {
    return AppUtil.FBMng.getAllAdminUserRoles().then(
      (list: IAdminUserRole[]) => {
        adminUserStateModule.setAllAdminUserRoles(list)
      }
    )
  }

  public static addAdminUserRole(userId: string) {
    return AppUtil.FBMng.saveAdminUserRole(userId, { role: 1 })
      .then(DataAccess.loadAllAdminUserRoles)
      .then(() => {
        generalStateModule.setToastMessage('管理者を追加しました')
      })
  }

  public static deleteAdminUserRole(userId: string) {
    return AppUtil.FBMng.deleteAdminUserRole(userId)
      .then(DataAccess.loadAllAdminUserRoles)
      .then(() => {
        generalStateModule.setToastMessage('管理者権限を削除しました')
      })
  }
}
