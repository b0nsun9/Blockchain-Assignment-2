import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("logout", "routes/logout.tsx"),
  layout("routes/logged-in-wrapper.tsx", [
    route("join", "routes/join.tsx")
  ])
] satisfies RouteConfig;
