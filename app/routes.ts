import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("logout", "routes/logout.tsx"),
  layout("routes/logged-in-wrapper.tsx", [
    layout("routes/create-event.tsx", [
      route("events", "routes/events.tsx"),
      route("create", "routes/create-block.tsx"),
    ])
  ])
] satisfies RouteConfig;
