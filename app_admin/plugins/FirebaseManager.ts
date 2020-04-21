import * as firebase from 'firebase/app'
import * as firebaseui from 'firebaseui'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import { IVote } from '../../common/interfaces/IVote'
import { IPowerVoter } from '../../common/interfaces/IPowerVoter'
import BaseFirebaseManager from '~/../common/plugins/BaseFirebaseManager'
import { IAdminLogonData } from '~/../common/interfaces/IAdminLogonData'
import { IAdminUser } from '~/../common/interfaces/IAdminUser'
import { INominate } from '~/../common/interfaces/INominate'
import { IRound } from '~/../common/interfaces/IRound'
import DocumentSnapshot = firebase.firestore.DocumentSnapshot
import DocumentData = firebase.firestore.DocumentData
import QuerySnapshot = firebase.firestore.QuerySnapshot

/**
 * Firebaseに関係する処理のラッパー
 */
export default class FirebaseManager extends BaseFirebaseManager {
  private authUI: firebaseui.auth.AuthUI | undefined

  public startUI(
    element: string,
    successCallback: Function,
    uiShownCallback: Function | null = null
  ) {
    const uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult(authResult: any, redirectUrl: any) {
          if (authResult.user) {
            successCallback(authResult)
          } else {
            console.error('authResult user is empty', authResult)
          }
          return false
        },
        uiShown() {
          if (uiShownCallback) {
            uiShownCallback()
          }
        }
      },
      signInSuccessUrl: '/',
      signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID]
    }
    return this.generateAuthUI().start(element, uiConfig)
  }

  private generateAuthUI() {
    if (this.authUI) {
      return this.authUI
    }
    this.authUI = new firebaseui.auth.AuthUI(firebase.auth())
    return this.authUI
  }

  public getLogonData() {
    const authUser = this.getCurrentUser()
    if (!authUser) {
      throw new Error('auth user is null')
    }
    const userId = authUser.uid
    let logonUser: IAdminUser = { name: '', mail: '' }

    return this.db
      .collection('adminUsers')
      .doc(userId)
      .get()
      .then((doc: DocumentSnapshot<DocumentData>) => {
        if (doc.exists) {
          logonUser = this.commonParseDoc(doc.data())
        } else {
          if (authUser.email !== null) {
            logonUser.mail = authUser.email
          }
          if (authUser.displayName) {
            logonUser.name = authUser.displayName
          }
          return this.db
            .collection('adminUsers')
            .doc(userId)
            .set(logonUser)
        }
      })
      .then(() => {
        return this.db
          .collection('adminUserRoles')
          .doc(userId)
          .get()
          .then((doc) => {
            if (doc.exists) {
              // @ts-ignore
              return doc.data().role
            } else {
              return 0
            }
          })
      })
      .then(
        (role): IAdminLogonData => {
          return { adminUser: logonUser, role }
        }
      )
  }

  public getNominates() {
    return this.db
      .collection('nominates')
      .get()
      .then((querySnapshot) => {
        const list: INominate[] = []
        querySnapshot.forEach((doc) => {
          const row: INominate = this.commonParseDoc(doc.data())
          list.push(row)
        })
        return list
      })
  }

  public getRound(roundId: string) {
    return this.db
      .collection('rounds')
      .doc(roundId)
      .get()
      .then((doc: DocumentSnapshot<DocumentData>): IRound | null => {
        if (doc.exists) {
          return this.commonParseDoc(doc.data())
        }
        return null
      })
  }

  public saveRound(roundId: string, round: IRound) {
    return this.db
      .collection('rounds')
      .doc(roundId)
      .set(round, { merge: true })
  }

  public getVotes() {
    return this.db
      .collection('votes')
      .get()
      .then((querySnapshot) => {
        const list: IVote[] = []
        querySnapshot.forEach((doc) => {
          const row: IVote = this.commonParseDoc(doc.data())
          list.push(row)
        })
        return list
      })
  }

  public getPowerVoters() {
    return this.db
      .collection('powerVoters')
      .get()
      .then((querySnapshot) => {
        const list: IPowerVoter[] = []
        querySnapshot.forEach((doc) => {
          const row: IPowerVoter = this.commonParseDoc(doc.data())
          list.push(row)
        })
        return list
      })
  }

  public watchVotes(callback: Function) {
    return this.db
      .collection('votes')
      .onSnapshot((querySnapshot: QuerySnapshot<DocumentData>) => {
        querySnapshot.docChanges().forEach((change) => {
          console.info('votes変更検知', change.type, change.doc.data())
          callback(change.type, change.doc.data())
        })
        //        console.info('votes変更検知', doc.data())
        //        callback(doc.data())
      })
  }
}
