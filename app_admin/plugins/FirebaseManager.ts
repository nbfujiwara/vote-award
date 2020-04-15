import * as firebase from 'firebase/app'
import * as firebaseui from 'firebaseui'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import BaseFirebaseManager from '~/../common/plugins/BaseFirebaseManager'
import { IAdminLogonData } from '~/../common/interfaces/IAdminLogonData'
import { IAdminUser } from '~/../common/interfaces/IAdminUser'
import { INominate } from '~/../common/interfaces/INominate'
import DocumentSnapshot = firebase.firestore.DocumentSnapshot
import DocumentData = firebase.firestore.DocumentData

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

  public saveEntrySheet(sheet: number[]) {
    const authUser = this.getCurrentUser()
    if (!authUser) {
      throw new Error('auth user is null')
    }
    return this.db
      .collection('entries')
      .doc(authUser.uid)
      .set({ sheet }, { merge: true })
  }

  public watchGameHits(gameId: string, callback: Function) {
    return this.db
      .collection('games')
      .doc(gameId)
      .onSnapshot((doc: DocumentSnapshot<DocumentData>) => {
        console.info('games変更検知', doc.data())
        callback(doc.data())
      })
  }
}