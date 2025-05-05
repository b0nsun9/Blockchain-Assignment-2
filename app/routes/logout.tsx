import { redirect } from "react-router"
import { session } from "~/cookies"

export async function loader() {
  return redirect("/", {
    headers: {
      "Set-Cookie": await session.serialize("", {
        expires: new Date(0)
      })
    }
  })
}

export default function Logout() {
  return (
    <div>
    </div>
  )
}