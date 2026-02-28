import { action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { GoogleGenAI } from "@google/genai";

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
Return ONLY a JSON array of 3 strings. No explanation.

Notes:
${notesContent}`;

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const text = (response.text ?? "").trim();

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
