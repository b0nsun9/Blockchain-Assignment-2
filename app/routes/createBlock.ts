import { calculateHashForEvent, calculateHashForAttendance } from "./calculateHash"
import { type Block as ClientBlock, type AttendanceData as ClientAttendanceData, type EventData as ClientEventData } from "../.client/block.client"
import { Timestamp } from "firebase/firestore"

export async function createBlockForAttendance(attendanceData: ClientAttendanceData, latestBlock?: ClientBlock) {

  const DIFFICULTY = 4
  const DIFFICULTY_PREFIX = "0".repeat(DIFFICULTY)

  const previousHash = latestBlock ? latestBlock.hash : "0000000000000000000000000000000000000000000000000000000000000000"
  const index = latestBlock ? latestBlock.index + 1 : 0

  let nonce = 0
  let timestamp = Timestamp.now()
  const attendString = JSON.stringify(attendanceData)

  let hash = await calculateHashForAttendance(index, previousHash, timestamp.nanoseconds, nonce, attendString)

  while (hash.substring(0, DIFFICULTY) !== DIFFICULTY_PREFIX) {
    nonce++
    timestamp = Timestamp.now()

    hash = await calculateHashForAttendance(index, previousHash, timestamp.nanoseconds, nonce, attendString)

    if (nonce % 1000 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0))
    }
  }

  const clientBlock: ClientBlock = {
    index: index,
    previousHash: previousHash,
    timeStamp: timestamp,
    attendanceData: attendanceData,
    nonce: nonce,
    hash: hash
  }

  return clientBlock

}

export async function createBlockForEvent(eventData: ClientEventData, latestBlock?: ClientBlock | undefined) {

  const DIFFICULTY = 4
  const DIFFICULTY_PREFIX = "0".repeat(DIFFICULTY)

  const previousHash = latestBlock ? latestBlock.hash : "0000000000000000000000000000000000000000000000000000000000000000"
  const index = latestBlock ? latestBlock.index + 1 : 0

  let nonce = 0
  let timestamp = Timestamp.now()
  const eventString = JSON.stringify(eventData)

  let hash = await calculateHashForEvent(index, previousHash, timestamp.nanoseconds, nonce, eventString)

  while (hash.substring(0, DIFFICULTY) !== DIFFICULTY_PREFIX) {
    nonce++
    timestamp = Timestamp.now()

    hash = await calculateHashForEvent(index, previousHash, timestamp.nanoseconds, nonce, eventString)

    if (nonce % 1000 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0))
    }
  }

  const clientBlock: ClientBlock = {
    index: index,
    previousHash: previousHash,
    timeStamp: timestamp,
    eventData: eventData,
    nonce: nonce,
    hash: hash
  }

  return clientBlock

}