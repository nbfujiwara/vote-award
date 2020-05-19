import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import BaseFirebaseManager from '~/../common/plugins/BaseFirebaseManager'
import { IVote } from '~/../common/interfaces/IVote'
import { INormalLogonData } from '~/../common/interfaces/INormalLogonData'
import { INominate } from '~/../common/interfaces/INominate'
import DocumentSnapshot = firebase.firestore.DocumentSnapshot
import DocumentData = firebase.firestore.DocumentData

/**
 * Firebaseに関係する処理のラッパー
 */
export default class FirebaseManager extends BaseFirebaseManager {
  public getLogonData(roundId: string) {
    const authUser = this.getCurrentUser()
    if (!authUser) {
      throw new Error('auth user is null')
    }
    const userId = authUser.uid
    const logonData: INormalLogonData = {
      vote: {
        user: { name: '', mail: '' },
        nominateId: null
      },
      round: {
        isClosed: false,
        isPublished: false
      }
    }
    return this.db
      .collection('votes')
      .doc(userId)
      .get()
      .then(async (doc: DocumentSnapshot<DocumentData>) => {
        if (doc.exists) {
          logonData.vote = this.commonParseDoc(doc.data())
        } else {
          if (authUser.email !== null) {
            logonData.vote.user.mail = authUser.email
          }
          if (authUser.displayName) {
            logonData.vote.user.name = authUser.displayName
          }
          await this.saveVote(logonData.vote)
        }
      })
      .then(() => {
        return this.db
          .collection('rounds')
          .doc(roundId)
          .get()
          .then((doc) => {
            if (doc.exists) {
              logonData.round = this.commonParseDoc(doc.data())
            }
          })
      })
      .then(
        (): INormalLogonData => {
          return logonData
        }
      )
  }

  public saveVote(vote: IVote) {
    const authUser = this.getCurrentUser()
    if (!authUser) {
      throw new Error('auth user is null')
    }
    return this.db
      .collection('votes')
      .doc(authUser.uid)
      .set(vote)
  }

  public watchRound(roundId: string, callback: Function) {
    return this.db
      .collection('rounds')
      .doc(roundId)
      .onSnapshot((doc) => {
        console.info('round変更検知', doc.data())
        callback(doc.data())
      })
  }
}
