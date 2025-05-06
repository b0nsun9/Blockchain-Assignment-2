import type { Route } from "./+types/events"
import { useEffect, useState } from "react"
import { onSnapshot, collection, type DocumentData, Timestamp, GeoPoint } from "firebase/firestore"
import { database as clientDatabase } from "../.client/firebase.client"
import type { AttendanceData as ClientAttendanceData } from "~/.client/block.client"
import { session } from "~/cookies"
import { redirect, useFetcher } from "react-router"
import { auth as serverAuth } from "../.server/firebase.server"
import { createBlockForAttendance } from "./createBlock"
import type { Block as ClientBlock } from "../.client/block.client"

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

export default function Events({ loaderData }: Route.ComponentProps) {

  const getCurrentLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."))
        return
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        maximumAge: 0
      })
    })
  }

  const [events, setEvents] = useState<DocumentData>([])
  const [blockChain, setBlockChain] = useState<ClientBlock[]>()

  useEffect(() => {

    const unsubscribe = onSnapshot(collection(clientDatabase, "blockchain"), (snapshot) => {

      const events = snapshot.docs
        .map((doc) => {
          return doc.data()
        })
        .filter((doc) => {
          return doc.eventData !== undefined
        })
        .sort((block1, block2) => {
          return block2.index - block1.index
        })

      setEvents(events)

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

  const [miningStatus, setMiningStatus] = useState<string>("Attend")
  const [isMining, setIsMining] = useState<boolean>(false)

  const fetcher = useFetcher()

  const handleAttend = async (event: string) => {
    setMiningStatus("Attending...")
    setIsMining(true)

    let location: GeoPoint

    try {
      const currentLocation = await getCurrentLocation()
      location = new GeoPoint(currentLocation.coords.latitude, currentLocation.coords.longitude)

      const attendanceData: ClientAttendanceData = {
        timeStamp: Timestamp.now(),
        location: location,
        userId: loaderData.uid,
        eventId: event
      }

      const newBlock = await createBlockForAttendance(attendanceData, blockChain?.pop())



      const blockString = JSON.stringify(newBlock)

      fetcher.submit({ blockString }, { method: "post", action: "/create" })
    } catch { }

    setIsMining(false)
    setMiningStatus("Attend")

  }

  return (
    <div>
      <div className="text-4xl">
        Events
      </div>
      <div className="flex flex-col gap-10 mt-10">
        {
          events.map((event: DocumentData) => (
            <div key={event.hash} className="flex justify-between items-center gap-4">
              <div>
                {event.eventData.name}
              </div>
              <button
                type="submit"
                disabled={isMining}
                className={`${isMining ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                onClick={() => handleAttend(event.eventData.id)}
              >
                {miningStatus}
              </button>
            </div>
          ))
        }
      </div>
    </div>
  )
}