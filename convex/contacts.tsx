import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";

type ContactUser = {
  id: Id<"users">;
  name: string;
  email: string;
  imageUrl?: string;
  type: "user";
};

type ContactGroup = {
  id: Id<"groups">;
  name: string;
  description: string;
  memberCount: number;
  type: "group";
};

export const getAllContacts = query(
  async (
    ctx
  ): Promise<{
    users: ContactUser[];
    groups: ContactGroup[];
  }> => {
    const currentUser = await ctx.runQuery(internal.users.getCurrentUser);
    if (!currentUser) throw new Error("Not authenticated");

    const expensesYouPaid = await ctx.db
      .query("expenses")
      .withIndex("by_user_and_group", (q) =>
        q.eq("paidByUserId", currentUser._id).eq("groupId", undefined)
      )
      .collect();

    const expensesNotPaidByYou = (
      await ctx.db
        .query("expenses")
        .withIndex("by_group", (q) => q.eq("groupId", undefined))
        .collect()
    ).filter(
      (e) =>
        e.paidByUserId !== currentUser._id &&
        e.splits.some((s) => s.userId === currentUser._id)
    );

    const personalExpenses = [...expensesYouPaid, ...expensesNotPaidByYou];

    const contactIds = new Set<Id<"users">>();
    personalExpenses.forEach((exp) => {
      if (exp.paidByUserId !== currentUser._id)
        contactIds.add(exp.paidByUserId);
      exp.splits.forEach((s) => {
        if (s.userId !== currentUser._id) contactIds.add(s.userId);
      });
    });

    const contactUsers = await Promise.all(
      [...contactIds].map(async (id): Promise<ContactUser | null> => {
        const u = await ctx.db.get(id);
        if (!u || !("email" in u)) return null; // Prevent accident with wrong type
        return {
          id: u._id,
          name: u.name,
          email: u.email,
          imageUrl: u.imageUrl,
          type: "user",
        };
      })
    );

    const userGroups = (await ctx.db.query("groups").collect())
      .filter((g) => g.members.some((m) => m.userId === currentUser._id))
      .map((g) => ({
        id: g._id,
        name: g.name,
        description: g.description,
        memberCount: g.members.length,
        type: "group",
      }));

    contactUsers.sort((a, b) => a!.name.localeCompare(b!.name));
    userGroups.sort((a, b) => a.name.localeCompare(b.name));

    return {
      users: contactUsers.filter(Boolean) as ContactUser[],
      groups: userGroups,
    };
  }
);

export const createGroup = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    members: v.array(v.id("users")),
  },
  handler: async (
    ctx,
    args: {
      name: string;
      description?: string;
      members: Id<"users">[];
    }
  ): Promise<Id<"groups">> => {
    const currentUser = await ctx.runQuery(internal.users.getCurrentUser);
    if (!currentUser) throw new Error("Not authenticated");

    if (!args.name.trim()) throw new Error("Group name cannot be empty");

    const uniqueMembers = new Set(args.members);
    uniqueMembers.add(currentUser._id);

    for (const id of uniqueMembers) {
      const user = await ctx.db.get(id);
      if (!user || !("email" in user)) {
        throw new Error(`User with ID ${id} not found or is invalid`);
      }
    }

    return await ctx.db.insert("groups", {
      name: args.name.trim(),
      description: args.description?.trim() ?? "",
      createdBy: currentUser._id,
      members: [...uniqueMembers].map((id) => ({
        userId: id,
        role: id === currentUser._id ? "admin" : "member",
        joinedAt: Date.now(),
      })),
    });
  },
});


