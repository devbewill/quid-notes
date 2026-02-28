import { action, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Server-side Gemini call — never exposes the API key to the client.
 * Returns exactly 3 actionable task proposals from the selected notes.
 */
export const generateProposals = action({
  args: {
    notes: v.array(
      v.object({
        title: v.string(),
        text: v.string(),
      })
    ),
  },
  handler: async (ctx, args): Promise<string[]> => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("UNAUTHENTICATED");

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

    const notesContent = args.notes
      .map((n, i) => `${i + 1}. ${n.title}\n${n.text}`)
      .join("\n\n");

    const prompt = `You are an assistant that converts raw notes into actionable tasks.
Given the following notes, extract the underlying intent and generate exactly 3 concise, actionable task proposals.
Each proposal must be a single sentence starting with a verb (e.g., "Request", "Schedule", "Define").
Return ONLY a JSON array of 3 strings in English. No explanation.

Notes:
${notesContent}`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent(prompt);
    const text = (result.response.text() ?? "").trim();

    // Strip markdown code fences if present
    const cleaned = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");

    let proposals: unknown;
    try {
      proposals = JSON.parse(cleaned);
    } catch {
      throw new Error(`Gemini returned invalid JSON: ${cleaned.slice(0, 200)}`);
    }

    if (
      !Array.isArray(proposals) ||
      proposals.length !== 3 ||
      !proposals.every((p) => typeof p === "string" && p.trim().length > 0)
    ) {
      throw new Error("Gemini did not return exactly 3 non-empty string proposals");
    }

    return proposals as string[];
  },
});

export const getAllData = internalQuery({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("UNAUTHENTICATED");
    const notes = await ctx.db
      .query("notes")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .filter((q: any) => q.eq(q.field("deletedAt"), undefined))
      .collect();
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .filter((q: any) => q.eq(q.field("deletedAt"), undefined))
      .collect();
    return { notes, tasks };
  },
});

export const askAssistant = action({
  args: { prompt: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("UNAUTHENTICATED");
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

    const data = await ctx.runQuery(internal.ai.getAllData, {});

    const context = `Notes:\n${data.notes.map((n) => `- ${n.title}: ${n.text}`).join("\n")}\n\nTasks:\n${data.tasks.map((t) => `- ${t.title}: ${t.text}`).join("\n")}`;

    const prompt = `You are Quid AI Assistant, an intelligent, helpful assistant embedded within the user's notes and tasks application.
Here is all the current user's data:

${context}

Answer the following question concisely based *only* on the provided data. Give a brief but insightful and helpful response. Use formatting where appropriate.
If the answer is not in the data, state it politely.
IMPORTANT: Always respond in English.

User Query: ${args.prompt}`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash" });
    const result = await model.generateContent(prompt);
    return (result.response.text() ?? "").trim();
  },
});
