import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

/**
 * Get the current user's RSVP for a specific event
 * Returns the RSVP document or null if not found
 */
export const getUserRsvpForEvent = query({
  args: {
    eventId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      return null;
    }

    const rsvp = await ctx.db
      .query("rsvps")
      .withIndex("by_user_and_event", (q) =>
        q.eq("userId", user._id).eq("eventId", args.eventId)
      )
      .unique();

    return rsvp;
  },
});

/**
 * Get all RSVPs for the current user
 */
export const getUserRsvps = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      return [];
    }

    const rsvps = await ctx.db
      .query("rsvps")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return rsvps;
  },
});

/**
 * Get the count of RSVPs for a specific event
 * Useful for showing capacity/availability
 */
export const getEventRsvpCount = query({
  args: {
    eventId: v.string(),
  },
  handler: async (ctx, args) => {
    const rsvps = await ctx.db
      .query("rsvps")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    // Sum up all guests across RSVPs
    const totalGuests = rsvps.reduce((sum, rsvp) => sum + rsvp.guests, 0);

    return {
      rsvpCount: rsvps.length,
      totalGuests,
    };
  },
});

/**
 * Create a new RSVP for an event
 * Prevents duplicate RSVPs for the same user+event
 */
export const createRsvp = mutation({
  args: {
    eventId: v.string(),
    guests: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new Error("You must be logged in to RSVP");
    }

    // Check for existing RSVP
    const existingRsvp = await ctx.db
      .query("rsvps")
      .withIndex("by_user_and_event", (q) =>
        q.eq("userId", user._id).eq("eventId", args.eventId)
      )
      .unique();

    if (existingRsvp) {
      throw new Error("You have already RSVP'd to this event");
    }

    // Validate guests count
    if (args.guests < 1 || args.guests > 10) {
      throw new Error("Number of guests must be between 1 and 10");
    }

    // Create the RSVP
    const rsvpId = await ctx.db.insert("rsvps", {
      userId: user._id,
      eventId: args.eventId,
      guests: args.guests,
      notes: args.notes,
      createdAt: Date.now(),
    });

    return { rsvpId, success: true };
  },
});

/**
 * Cancel/delete an RSVP for an event (US-010)
 */
export const cancelRsvp = mutation({
  args: {
    eventId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new Error("You must be logged in to cancel an RSVP");
    }

    // Find the user's RSVP for this event
    const rsvp = await ctx.db
      .query("rsvps")
      .withIndex("by_user_and_event", (q) =>
        q.eq("userId", user._id).eq("eventId", args.eventId)
      )
      .unique();

    if (!rsvp) {
      throw new Error("No RSVP found for this event");
    }

    // Delete the RSVP
    await ctx.db.delete(rsvp._id);

    return { success: true };
  },
});

/**
 * Update an existing RSVP (e.g., change number of guests)
 */
export const updateRsvp = mutation({
  args: {
    eventId: v.string(),
    guests: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new Error("You must be logged in to update an RSVP");
    }

    // Find the user's RSVP for this event
    const rsvp = await ctx.db
      .query("rsvps")
      .withIndex("by_user_and_event", (q) =>
        q.eq("userId", user._id).eq("eventId", args.eventId)
      )
      .unique();

    if (!rsvp) {
      throw new Error("No RSVP found for this event");
    }

    // Validate guests count
    if (args.guests < 1 || args.guests > 10) {
      throw new Error("Number of guests must be between 1 and 10");
    }

    // Update the RSVP
    await ctx.db.patch(rsvp._id, {
      guests: args.guests,
      notes: args.notes,
    });

    return { success: true };
  },
});
