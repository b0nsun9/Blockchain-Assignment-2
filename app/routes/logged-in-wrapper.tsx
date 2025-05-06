import type { Route } from "./+types/logged-in-wrapper"
import { Link, Outlet, redirect } from "react-router"

import { session } from "~/cookies"
import { auth as serverAuth } from "../.server/firebase.server"

export async function loader({ request }: Route.LoaderArgs) {

  const jwt = await session.parse(request.headers.get("Cookie"))

  if (!jwt) {
    return redirect("/login")
  }

  try {
    
    const idToken = await serverAuth.verifySessionCookie(jwt)

    return {
      name: idToken.name,
      uid: idToken.uid
    }

  } catch (error) {
    console.error(error)
    return redirect("/login")
  }
}

export default function LoggedInWapper({ loaderData }: Route.ComponentProps) {
  return (
    <div className="m-10">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <p>Hello, {loaderData.name}</p>
          <p>User ID: {loaderData.uid}</p>
        </div>
        <div>
          <Link to="/logout">Sign Out</Link>
        </div>
      </div>
      <Outlet />
    </div>
  )
}