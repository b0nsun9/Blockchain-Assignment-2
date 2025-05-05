import { initializeApp, getApps, cert, getApp } from "firebase-admin/app"
import type { App } from "firebase-admin/app"
import { Auth, getAuth } from "firebase-admin/auth"

let app: App
let auth: Auth

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
} else {
  app = getApp()
  auth = getAuth(app)
}

export { auth }