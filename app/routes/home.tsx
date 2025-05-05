import { Link } from "react-router";
import type { Route } from "./+types/home";
import { AuthProvider } from "./authProvider";

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
      <Link to="/join">
        Join the network
      </Link>
    </div>
  )
}