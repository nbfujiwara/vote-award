import * as firebase from 'firebase/app'
import * as firebaseui from 'firebaseui'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import UtilDate from "./UtilDate"
import {INominate} from "../interfaces/INominate"

export default class BaseFirebaseManager {
  protected db: firebase.firestore.Firestore
  protected authUI: firebaseui.auth.AuthUI | undefined

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

  protected generateAuthUI() {
    if (this.authUI) {
      return this.authUI
    }
    this.authUI = new firebaseui.auth.AuthUI(firebase.auth())
    return this.authUI
  }

  public startUI(
    element: string,
    successCallback: Function,
    uiShownCallback: Function | null = null
  ) {
    firebase.auth().languageCode = 'ja'
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
      signInOptions: [
        {
          provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          customParameters: {
            hd: process.env.ENV_GOOGLE_AUTH_HD
          }
        }]
    }
    return this.generateAuthUI().start(element, uiConfig)
  }
  public getCurrentUser() {
    return firebase.auth().currentUser
  }
  public logout() {
    return firebase
      .auth()
      .signOut()
  }


  public getNominates(roundId: string) {
    return this.db
      .collection('rounds')
      .doc(roundId)
      .collection('nominates')
      .orderBy('id')
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
      }else if (typeof (val) == "string" || val instanceof String) {
        obj[key] = val.replace(/\\n/g,"\n")
      }
    })
    return obj
  }
}
