import type { Route } from "./+types/create-event"
import { Outlet, redirect, useFetcher } from "react-router"
import { useEffect, useState } from "react"
import { session } from "~/cookies"
import { auth as serverAuth } from "../.server/firebase.server"
import { collection, onSnapshot } from "firebase/firestore"
import { database as clientDatabase } from "../.client/firebase.client"
import { createBlockForAttendance, createBlockForEvent } from "./createBlock"
import { type EventData as ClientEventData, type Block as ClientBlock } from "../.client/block.client"

export async function loader({ request }: Route.LoaderArgs) {

  const jwt = await session.parse(request.headers.get("Cookie"))

  if (!jwt) {
    return redirect("/login")
  }

  try {

    const idToken = await serverAuth.verifySessionCookie(jwt)

    return {
      uid: idToken.uid
    }

  } catch (error) {
    console.error(error)
    return redirect("/login")
  }
}

export default function CreateEvent({ loaderData }: Route.ComponentProps) {

  const [miningStatus, setMiningStatus] = useState<string>("Create Event")
  const [isMining, setIsMining] = useState<boolean>(false)

  const [blockChain, setBlockChain] = useState<ClientBlock[]>()
  const [eventName, setEventName] = useState<string>("")

  const fetcher = useFetcher()

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(clientDatabase, "blockchain"), (snapshot) => {

      const blocks = snapshot.docs
        .map((doc) => {
          const data = doc.data()

          const clientBlock: ClientBlock = {
            index: data.index,
            previousHash: data.previousHash,
            timeStamp: data.timeStamp,
            attendanceData: data.attendanceData,
            eventData: data.eventData,
            nonce: data.nonce,
            hash: data.hash
          }

          return clientBlock
        })
        .sort((block1, block2) => {
          return block1.index - block2.index 
        })


      setBlockChain(blocks)

    })

    return () => unsubscribe()
  }, [])

  const handleCreateEvent = async () => {
    if (isMining) return

    setIsMining(true)
    setMiningStatus("Creating Event...")

    const eventData: ClientEventData = {
      id: crypto.randomUUID(),
      name: eventName,
      createdBy: loaderData.uid
    }

    const newBlock = await createBlockForEvent(eventData, blockChain?.pop())

    setIsMining(false)
    setMiningStatus("Create Event")

    const blockString = JSON.stringify(newBlock)

    fetcher.submit({ blockString }, { method: "post", action: "/create" })

    setEventName("")

  }

  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <div className="flex flex-col items-center gap-3">
        <div className="w-full max-w-xs">
          <label className="mb-1">New Event</label>
          <input
            type="text"
            id="eventName"
            name="dataInput"
            disabled={(isMining)}
            value={eventName}
            onChange={(event) => {
              event.preventDefault()
              setEventName(event.target.value)
            }}
            className={`border rounded w-full py-2 px-3 focus:outline-none focus:shadow-outline ${isMining ? 'bg-gray-500 cursor-not-allowed' : ''
              }`}
            placeholder="Evnet name"
          />
        </div>
        <button
          disabled={(isMining) || (eventName === "")}
          className={`text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${(isMining) || (eventName === "") ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          onClick={handleCreateEvent}
        >
          {miningStatus}
        </button>
      </div>
      <div className="mt-10">
        <Outlet />
      </div>
    </div>
  )
}