import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function generateForensicTrace(tx: any): Promise<string> {
  if (!apiKey) {
    return "API_KEY_MISSING: Forensic trace cannot be retrieved from neural engine.";
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Generate a short technical "Autonomous Reasoning Trace" for a transaction audit log. 
      The transaction is for ${tx.amount} ${tx.currency} from Agent ${tx.agentId} to ${tx.merchantDomain}.
      Format it as a professional log entry with technical details like inventory thresholds, gas prices, and optimization logic.
      Keep it under 100 words. Start with a timestamp-like identifier.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || "Trace analysis failed to load.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error retrieving forensic trace from neural engine.";
  }
}
