import { Outlet } from "react-router"
import { useEffect, useState } from "react"
import type { Block as ClientBlock } from "../.client/block.client"
import { onSnapshot, collection } from "firebase/firestore"
import { database as clientDatabase} from "../.client/firebase.client"

export default function Blocks() {
  const [blockChain, setBlockChain] = useState<ClientBlock[]>()

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
          return block2.index - block1.index
        })


      setBlockChain(blocks)

    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="w-full overflow-hidden">
      {/* <h2 className="text-2xl font-bold mb-4">Blockchain Blocks</h2> */}
      <div className="flex overflow-x-auto py-4 space-x-4">
        {blockChain ? (
          blockChain.map((block) => (
            <div
              key={block.hash}
              className="bg-blue-600 text-white p-4 rounded-lg shadow-md min-w-[350px] flex-shrink-0"
            >
              <h3 className="text-lg font-semibold border-b border-blue-400 pb-1 mb-2">Block #{block.index}</h3>
              <p className="text-sm break-all"><strong>Hash:</strong> {block.hash}</p>
              <p className="text-sm break-all"><strong>Prev Hash:</strong> {block.previousHash}</p>
              {/* <p className="text-sm"><strong>Timestamp:</strong>{block.timeStamp.seconds}</p> */}
              <p className="text-sm"><strong>Nonce:</strong> {block.nonce}</p>
              {block.eventData && (
                <div className="mt-2 pt-2 border-t border-blue-400">
                  <p className="text-sm font-medium">Event Data:</p>
                  <pre className="text-xs whitespace-pre-wrap break-all">{JSON.stringify(block.eventData, null, 2)}</pre>
                </div>
              )}
              {block.attendanceData && (
                <div className="mt-2 pt-2 border-t border-blue-400">
                  <p className="text-sm font-medium">Attendance Data:</p>
                  <pre className="text-xs whitespace-pre-wrap break-all">{JSON.stringify(block.attendanceData, null, 2)}</pre>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>Loading blockchain...</p>
        )}
      </div>
      <Outlet />
    </div>
  )
}