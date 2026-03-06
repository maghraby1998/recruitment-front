export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
export const GRAPHQL_URL = `${BACKEND_URL}/graphql`;
export const WS_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "ws://localhost:5000";
export const WS_GRAPHQL_URL = `${WS_BACKEND_URL}/graphql`;
