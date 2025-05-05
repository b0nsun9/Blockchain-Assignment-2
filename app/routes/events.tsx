import type { Route } from "./+types/events"
import { Link, redirect, type LoaderFunctionArgs } from "react-router"
import { useState } from "react"

export async function loader({ request }: LoaderFunctionArgs) {
  
}

export default function Events({ loaderData }: Route.ComponentProps) {
  const [miningStatus, setMiningStatus] = useState<string>("Idle");
  const [minedBlock, setMinedBlock] = useState<Block | null>(null);
  const [isMining, setIsMining] = useState<boolean>(false);

  const handleClick = async () => {
    if (isMining) return; // Prevent multiple mining processes

    setIsMining(true);
    setMiningStatus("Mining...");
    setMinedBlock(null);

    const difficulty = 4; // Number of leading zeros required
    const difficultyPrefix = "0".repeat(difficulty);

    // --- Mining Logic ---
    const blockData = `Block data for block #${minedBlock ? minedBlock.index + 1 : 0}`; // Example data
    const previousHash = minedBlock ? minedBlock.hash : "0"; // Use last mined block's hash or "0" for genesis
    const index = minedBlock ? minedBlock.index + 1 : 0;

    let nonce = 0;
    let timestamp = Date.now();
    let hash = await calculateHash(index, previousHash, timestamp, blockData, nonce);

    console.log(`Starting mining for block ${index} with difficulty ${difficulty}...`);

    // Keep trying nonces until the hash meets the difficulty requirement
    while (hash.substring(0, difficulty) !== difficultyPrefix) {
      nonce++;
      timestamp = Date.now(); // Update timestamp for each attempt? Optional.
      hash = await calculateHash(index, previousHash, timestamp, blockData, nonce);

      // Add a small delay to prevent freezing the browser UI during intense computation
      if (nonce % 1000 === 0) {
         setMiningStatus(`Mining... (Nonce: ${nonce}, Hash: ${hash.substring(0,10)}...)`);
         await new Promise(resolve => setTimeout(resolve, 0)); // Yield to the event loop
      }
    }

    const newBlock: Block = {
      index,
      timestamp,
      data: blockData,
      previousHash,
      nonce,
      hash,
    };

    console.log(`Block mined! Hash: ${hash}, Nonce: ${nonce}`);
    setMinedBlock(newBlock);
    setMiningStatus(`Mined Block ${newBlock.index}!`);
    setIsMining(false);
    // --- End Mining Logic ---
  };

  return (
    <div className="p-4 font-sans">
      <h1 className="text-2xl mb-4">Simple Blockchain Miner</h1>
      <div className="mb-4">
        <button
          onClick={handleClick}
          disabled={isMining}
          className={`px-4 py-2 rounded text-white ${
            isMining ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isMining ? "Mining..." : "Mine New Block"}
        </button>
        <p className="mt-2 text-sm text-gray-600">Status: {miningStatus}</p>
      </div>

      {minedBlock && (
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Last Mined Block</h2>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(minedBlock, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}