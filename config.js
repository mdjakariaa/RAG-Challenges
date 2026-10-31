import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";


/** Ensure the OpenRouter API key is available and correctly configured */
if (!process.env.OPENROUTER_API_KEY) {
  throw new Error("OpenRouter API key is missing or invalid.");
}

/** OpenRouter config */
export const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  dangerouslyAllowBrowser: true,
});


/** Supabase config */
const privateKey = process.env.SUPABASE_API_KEY;
if (!privateKey) throw new Error(`Expected env var SUPABASE_API_KEY`);
const url = process.env.SUPABASE_URL;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);
export const supabase = createClient(url, privateKey);
