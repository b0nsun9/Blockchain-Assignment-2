export async function calculateHash(
  index: number,
  previousHash: string,
  timestamp: number,
  data: string,
  nonce: number
): Promise<string> {
  const input = `${index}${previousHash}${timestamp}${data}${nonce}`
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}