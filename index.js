import { CharacterTextSplitter } from "@langchain/textsplitters";

async function splitDocument() {
  let text;
  // If running in Node.js (npm start)
  if (typeof window === "undefined") {
    const fs = await import("fs/promises");
    text = await fs.readFile("podcasts.txt", "utf-8");
  } else {
    // If running in browser via Vite (npm run dev)
    const response = await fetch("podcasts.txt");
    text = await response.text();
  }

  const splitter = new CharacterTextSplitter({
    separator: " ",
    chunkSize: 150,
    chunkOverlap: 15,
  });
  const output = await splitter.createDocuments([text]);
  console.log(output);
}

splitDocument();
