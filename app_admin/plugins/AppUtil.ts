import FirebaseManager from './FirebaseManager'
import { basicStateModule } from '~/store/modules/basic'
import { generalStateModule } from '~/store/modules/general'

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
        AppUtil.FBMng.getLogonData()
          .then((logonData) => {
            if (logonData) {
              if (logonData.role && logonData.role > 0) {
                generalStateModule.setHasRole(true)
              } else {
                generalStateModule.setHasRole(false)
              }
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
