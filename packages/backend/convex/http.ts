import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";

const http = httpRouter();

// Register auth routes with CORS disabled for mobile client compatibility
authComponent.registerRoutes(http, createAuth, { cors: false });

export default http;
