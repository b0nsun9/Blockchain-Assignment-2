export async function calculateHashForEvent(
  index: number,
  previousHash: string,
  timestamp: number,
  nonce: number,
  eventData: string
): Promise<string> {

  var input = `${index}${previousHash}${timestamp}${nonce}${eventData}`

  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}

export async function calculateHashForAttendance(
  index: number,
  previousHash: string,
  timestamp: number,
  nonce: number,
  attendanceData: string,
): Promise<string> {

  var input = `${index}${previousHash}${timestamp}${nonce}${attendanceData}`

  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}