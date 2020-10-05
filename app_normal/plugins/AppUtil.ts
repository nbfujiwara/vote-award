import FirebaseManager from './FirebaseManager'
import { basicStateModule } from '~/store/modules/basic'
import { generalStateModule } from '~/store/modules/general'
import DataAccess from '~/plugins/DataAccess'

/**
 * アプリ全体でゲーム関係に依存しない処理色々（認証など）
 */
export default class AppUtil {
  private static _FBMng: FirebaseManager

  public static get FBMng(): FirebaseManager {
    if (!AppUtil._FBMng) {
      AppUtil._FBMng = new FirebaseManager()
    }
    return AppUtil._FBMng
  }

  public static startAuthUI(
    element: string,
    successCallback: Function,
    uiShownCallback: Function | null = null
  ) {
    AppUtil.FBMng.startUI(
      element,
      (authResult: any) => {
        generalStateModule.setIsAuthorized(true)
        AppUtil.FBMng.getLogonData(DataAccess.ROUND_ID)
          .then((logonData) => {
            if (logonData) {
              if (logonData.vote.user) {
                basicStateModule.setUser(logonData.vote.user)
              }
              if (logonData.vote.nominateId) {
                basicStateModule.setVotedNominateId(logonData.vote.nominateId)
              } else {
                basicStateModule.setVotedNominateId(null)
              }
              basicStateModule.setVotedMultiNominateIds(
                logonData.vote.multiVote
              )
              basicStateModule.setIsPowerVoter(logonData.isPowerUser)
              basicStateModule.setVotePoint(logonData.votePoint)
              basicStateModule.setRound(logonData.round)
              successCallback()
            }
          })
          .catch((error) => {
            generalStateModule.setToastMessage(
              '初期データロード中にエラーが発生しました'
            )
            console.error(error)
          })
      },
      uiShownCallback
    )
  }

  public static logout() {
    return AppUtil.FBMng.logout().then(() => {
      generalStateModule.setIsAuthorized(false)
      generalStateModule.setToastMessage('ログアウトしました')
    })
  }
}
