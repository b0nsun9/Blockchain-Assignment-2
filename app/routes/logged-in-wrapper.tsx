import type { Route } from "./+types/logged-in-wrapper"
import { Link, Outlet, redirect, useNavigate, type LoaderFunctionArgs } from "react-router"

import { session } from "~/cookies"
import { auth as serverAuth } from "../server/firebase.server"

export async function loader({ request }: LoaderFunctionArgs) {

  console.log("logged in wrapper loader")

  const jwt = await session.parse(request.headers.get("Cookie"))

  if (!jwt) {
    return redirect("/login")
  }

  try {
    const idToken = await serverAuth.verifySessionCookie(jwt)

    return {
      name: idToken.name
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
        <div>
          <p>Hello, {loaderData.name}</p>
        </div>
        <div>
          <Link to="/logout">Sign Out</Link>
        </div>
      </div>
      <Outlet />
    </div>
  )
}