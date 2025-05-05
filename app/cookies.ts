import { createCookie } from "react-router"

export const session = createCookie("session", {
  secrets: ["secret"],
  expires: new Date(Date.now() + 60 * 60 * 24 * 5 * 1000),
  path: "/"
})