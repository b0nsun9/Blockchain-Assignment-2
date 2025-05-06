// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth, inMemoryPersistence, setPersistence } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBTWwgsFBX94dKEGZo3L1UIpfz1weYAstU",
  authDomain: "e-attendance-39efc.firebaseapp.com",
  projectId: "e-attendance-39efc",
  storageBucket: "e-attendance-39efc.firebasestorage.app",
  messagingSenderId: "612653192542",
  appId: "1:612653192542:web:298341f46f78abc5752bcf"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const database = getFirestore(app)

setPersistence(auth, inMemoryPersistence)

export { auth, database }