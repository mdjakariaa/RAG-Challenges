.env: Set up OPENROUTER_API_KEY=your_openrouter_key_here with a list of free embedding models documented in comments.

  
config.js: Kept the exact structure, updated the guard for OPENROUTER_API_KEY, and pointed to https://openrouter.ai/api/v1.

  
index.js: Kept the exact structure and updated the model string to OpenRouter's free embedding model: "nvidia/nemotron-3.5-embed-1b:free".

  
package.json & vite.config.js: Configured dependencies and scripts so you can run the project both in the terminal (npm start) and in the browser (npm run dev).
