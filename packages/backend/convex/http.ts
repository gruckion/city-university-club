import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";

const http = httpRouter();

// Register auth routes with CORS enabled for Expo web support
authComponent.registerRoutes(http, createAuth, { cors: true });

export default http;
