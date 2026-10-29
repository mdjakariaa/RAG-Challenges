import OpenAI from "openai";

/** Ensure the OpenRouter API key is available and correctly configured */
if (!process.env.OPENROUTER_API_KEY) {
  throw new Error("OpenRouter API key is missing or invalid.");
}


/** OpenRouter config */
export default new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  dangerouslyAllowBrowser: true,
});
