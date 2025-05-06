import { Link } from "react-router";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "e-Attendace" },
    { name: "description", content: "Created by Bonsung Koo from Whitireia and WelTec, powered by Blockchain mechanism" },
  ];
}

export default function Home() {
  return (
    <div className="flex flex-col h-screen items-center justify-center gap-4">
      <h1>Welcome to e-Attendace system</h1>
      <Link
        to="/events"
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Join the network
      </Link>
    </div>
  )
}