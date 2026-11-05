import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env.OPENROUTER_API_KEY": JSON.stringify(env.OPENROUTER_API_KEY || ""),
      "process.env.SUPABASE_API_KEY": JSON.stringify(env.SUPABASE_API_KEY || ""),
      "process.env.SUPABASE_URL": JSON.stringify(env.SUPABASE_URL || ""),
    },
  };
});
