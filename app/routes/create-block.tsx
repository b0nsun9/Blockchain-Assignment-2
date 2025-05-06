import type { Route } from "../+types/root"
import type { Block as ServerBlock } from "../.server/block.server"
import { database as serverDatabase } from "../.server/firebase.server"

export async function action({ request }: Route.ActionArgs) {

  const form = await request.formData()
  const blockString = form.get("blockString")?.toString()

  if (!blockString) { return null }

  const block = JSON.parse(blockString) as ServerBlock

  await serverDatabase.collection("blockchain").doc(block.hash).set(block)

  return null

}

export default function CreateBlock() {
  return (<div></div>)
}