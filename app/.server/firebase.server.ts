import { initializeApp, getApps, cert, getApp } from "firebase-admin/app"
import type { App } from "firebase-admin/app"
import { Auth, getAuth } from "firebase-admin/auth"
import { Firestore, getFirestore } from "firebase-admin/firestore"

let app: App
let auth: Auth
let database: Firestore

if (getApps().length === 0) {
  app = initializeApp({
    credential: cert(
      {
        projectId: process.env.SERVER_PROJECT_ID,
        clientEmail: process.env.SERVER_CLIENT_EMAIL,
        privateKey: process.env.SERVER_PRIVATE_KEY
      }
    )
  })
  auth = getAuth(app)
  database = getFirestore()
} else {
  app = getApp()
  auth = getAuth(app)
  database = getFirestore()
}

export { auth, database }