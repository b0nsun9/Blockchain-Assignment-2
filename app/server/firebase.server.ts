import { initializeApp, getApps, cert, getApp } from "firebase-admin/app"
import type { App } from "firebase-admin/app"
import { Auth, getAuth } from "firebase-admin/auth"

import serviceKey from "./firebase-adminsdk.json"

let app: App
let auth: Auth

if (getApps().length === 0) {
  app = initializeApp({
    credential: cert(
      {
        projectId: serviceKey.project_id,
        clientEmail: serviceKey.client_email,
        privateKey: serviceKey.private_key
      }
    )
  })
  auth = getAuth(app)
} else {
  app = getApp()
  auth = getAuth(app)
}

export { auth }