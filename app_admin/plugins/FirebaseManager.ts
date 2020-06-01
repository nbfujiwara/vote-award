import * as firebase from 'firebase/app'
import * as firebaseui from 'firebaseui'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import BaseFirebaseManager from '~/../common/plugins/BaseFirebaseManager'
import { IVote } from '~/../common/interfaces/IVote'
import { IPowerVoter } from '~/../common/interfaces/IPowerVoter'
import { IAdminLogonData } from '~/../common/interfaces/IAdminLogonData'
import { IAdminUser } from '~/../common/interfaces/IAdminUser'
import { IAdminUserRole } from '~/../common/interfaces/IAdminUserRole'
import { INominate } from '~/../common/interfaces/INominate'
import { IRound } from '~/../common/interfaces/IRound'
import DocumentSnapshot = firebase.firestore.DocumentSnapshot
import DocumentData = firebase.firestore.DocumentData
import QuerySnapshot = firebase.firestore.QuerySnapshot

/**
 * Firebaseに関係する処理のラッパー
 */
export default class FirebaseManager extends BaseFirebaseManager {
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
      .orderBy('mail')
      .get()
      .then((querySnapshot) => {
        const list: IPowerVoter[] = []
        querySnapshot.forEach((doc) => {
          const row: IPowerVoter = this.commonParseDoc(doc.data())
          row.docId = doc.id
          list.push(row)
        })
        return list
      })
  }

  public saveAddPowerVoter(data: IPowerVoter) {
    return this.db.collection('powerVoters').add(data)
  }

  public saveModifyPowerVoter(docId: string, data: IPowerVoter) {
    return this.db
      .collection('powerVoters')
      .doc(docId)
      .set(data)
  }

  public deletePowerVoter(docId: string) {
    return this.db
      .collection('powerVoters')
      .doc(docId)
      .delete()
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

  public getAllAdminUsers() {
    return this.db
      .collection('adminUsers')
      .orderBy('mail')
      .get()
      .then((querySnapshot) => {
        const list: IAdminUser[] = []
        querySnapshot.forEach((doc) => {
          const row: IAdminUser = this.commonParseDoc(doc.data())
          row.userId = doc.id
          list.push(row)
        })
        return list
      })
  }

  public getAllAdminUserRoles() {
    return this.db
      .collection('adminUserRoles')
      .get()
      .then((querySnapshot) => {
        const list: IAdminUserRole[] = []
        querySnapshot.forEach((doc) => {
          const row: IAdminUserRole = this.commonParseDoc(doc.data())
          row.userId = doc.id
          list.push(row)
        })
        return list
      })
  }

  public saveAdminUserRole(userId: string, data: IAdminUserRole) {
    return this.db
      .collection('adminUserRoles')
      .doc(userId)
      .set(data)
  }

  public deleteAdminUserRole(userId: string) {
    return this.db
      .collection('adminUserRoles')
      .doc(userId)
      .delete()
  }
}
