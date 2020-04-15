import { IVote } from '../../common/interfaces/IVote'
import AppUtil from './AppUtil'
import { basicStateModule } from '~/store/modules/basic'
import { generalStateModule } from '~/store/modules/general'
import { INominate } from '~/../common/interfaces/INominate'

/**
 * データの取得や送信
 */
export default class DataAccess {
  public static loadNominates() {
    AppUtil.FBMng.getNominates().then((list: INominate[]) => {
      basicStateModule.setNominates(list)
    })
  }


}
