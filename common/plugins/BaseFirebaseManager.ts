import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import UtilDate from "./UtilDate"

export default class BaseFirebaseManager {
  protected db: firebase.firestore.Firestore

  public constructor() {
    const apiKey = process.env.ENV_FB_API_KEY
    const projectId = process.env.ENV_FB_PROJECT_ID
    const authDomain = projectId + '.firebaseapp.com'
    const databaseURL = 'https://' + projectId + '.firebaseio.com'
    const storageBucket = projectId + '.appspot.com'
    const messagingSenderId = process.env.ENV_FB_MESSAGE_SENDER_ID

    const config = {
      apiKey,
      authDomain,
      databaseURL,
      projectId,
      storageBucket,
      messagingSenderId
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(config)
    }
    this.db = firebase.firestore()
  }
  public getCurrentUser() {
    return firebase.auth().currentUser
  }
  public logout() {
    return firebase
      .auth()
      .signOut()
  }


  public getGame(gameId: string) {
    return this.db
      .collection('games')
      .doc(gameId)
      .get()
      .then((doc: any) => {
        if (doc.exists) {
          return this.commonParseDoc(doc.data())
        } else {
          return null
        }
      })
  }
  /**
   * firebaseの型をJS用に変換する共通関数
   * @param obj
   * @returns any
   */
  protected commonParseDoc(obj: any) {
    Object.entries(obj).forEach(([key, val]) => {
      if (val instanceof Object) {
        if (val.constructor.name === 'Timestamp') {
          obj[key] = UtilDate.parseFirebase(val)
        } else if (val.hasOwnProperty('seconds')) {
          // constructor == timestampでひっかからんときがある
          obj[key] = UtilDate.parseFirebase(val)
        }
      }
    })
    return obj
  }
}
