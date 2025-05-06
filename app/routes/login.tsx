import type { Route } from "./+types/login"
import { redirect } from "react-router"

import { useFetcher } from "react-router"

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth as clientAuth } from "../.client/firebase.client"
import { auth as serverAuth } from "../.server/firebase.server"
import { session } from "~/cookies"

export async function loader({ request }: Route.LoaderArgs) {

  const jwt = await session.parse(request.headers.get("Cookie"))

  if (jwt) {
    try {
      await serverAuth.verifySessionCookie(jwt)

      return redirect("/events")
    } catch {
      return {}
    }
  } else {
    return {}
  }
}

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData()
  const idToken = form.get("idToken")?.toString()

  if (idToken) {
    await serverAuth.verifyIdToken(idToken)

    const jwt = await serverAuth.createSessionCookie(idToken, {
      expiresIn: 60 * 60 * 24 * 5 * 1000
    })

    return redirect("/events", {
      headers: {
        "Set-Cookie": await session.serialize(jwt)
      }
    })
  }

}

export default function Login() {

  const fetcher = useFetcher()

  const handleSignIn = async () => {

    try {

      const provider = new GoogleAuthProvider()

      const credential = await signInWithPopup(clientAuth, provider)
      const idToken = await credential.user.getIdToken()

      fetcher.submit({ idToken }, { method: "post", action: "/login" })

    } catch (error) {
      console.error("Google sign-in error:", error)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleSignIn}
      >
        Sign in with Google</button>
    </div>
  )
}