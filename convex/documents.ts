import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

//build create doc api
export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("document")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    });
  },
});

//build get all docs api
export const get = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const documents = await ctx.db.query("documents").collect();

    return documents;
  },
});
