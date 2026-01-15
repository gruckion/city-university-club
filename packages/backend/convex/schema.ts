import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    text: v.string(),
    completed: v.boolean(),
  }),

  // RSVPs for events
  rsvps: defineTable({
    userId: v.string(), // User ID from better-auth
    eventId: v.string(), // Event ID (matches hardcoded event.id)
    guests: v.number(), // Number of guests (1-5)
    notes: v.optional(v.string()), // Special requirements
    createdAt: v.number(), // Timestamp
  })
    .index("by_user", ["userId"])
    .index("by_event", ["eventId"])
    .index("by_user_and_event", ["userId", "eventId"]),
});
