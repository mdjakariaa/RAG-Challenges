.env: Set up OPENROUTER_API_KEY=your_openrouter_key_here with a list of free embedding models documented in comments.
  
config.js: Kept the exact structure, updated the guard for OPENROUTER_API_KEY, and pointed to https://openrouter.ai/api/v1.
  
index.js: Splits movies.txt with LangChain RecursiveCharacterTextSplitter and creates embeddings using OpenRouter's free embedding model "nvidia/llama-nemotron-embed-vl-1b-v2:free" (2048 dimensions matching Supabase), inserting content and embeddings into the Supabase documents table.
  
package.json & vite.config.js: Configured dependencies and scripts so you can run the project both in the terminal (npm start) and in the browser (npm run dev).
