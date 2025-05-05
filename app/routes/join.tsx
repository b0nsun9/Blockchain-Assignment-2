import type { Route } from "./+types/join"
import { Form, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router"
import { session } from "~/cookies"
import { auth as serverAuth } from "../server/firebase.server"

export async function loader({ request }: LoaderFunctionArgs) {

  console.log("join loader")

  const jwt = await session.parse(request.headers.get("Cookie"))

  if (!jwt) {
    return redirect("/login")
  }

  try {
    const idToken = await serverAuth.verifySessionCookie(jwt)

    return {
      publicKey: idToken.uid
    }
  } catch (error) {
    console.error(error)
    return redirect("/login")
  }
}

export async function action({ request }: ActionFunctionArgs) {

}

export default function Join({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <h1>
        Your public key: {loaderData.publicKey}
      </h1>
      <Form method="post" className="mt-4 flex flex-col space-y-4 items-center">
        <div className="w-full max-w-xs">
          <label className="mb-1">Join to :</label>
          <input
            type="text"
            id="dataInput"
            name="dataInput"
            className="border rounded w-full py-2 px-3 focus:outline-none focus:shadow-outline"
            placeholder="Public key of a event"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </Form>
    </div>
  )
}