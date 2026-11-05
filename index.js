import { openai, supabase } from "./config.js";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

/*
  Challenge: Text Splitters, Embeddings, and Vector Databases!
    1. Use LangChain to split the content in movies.txt into smaller chunks.
    2. Use OpenAI's Embedding model to create an embedding for each chunk.
    3. Insert all text chunks and their corresponding embedding
       into a Supabase database table.
 */

/* Split movies.txt into text chunks.
Return LangChain's "output" – the array of Document objects. */
async function splitDocument(document) {
  let text;
  // If running in Node.js (npm start)
  if (typeof window === "undefined") {
    const fs = await import("fs/promises");
    text = await fs.readFile(document, "utf-8");
  } else {
    // If running in browser via Vite (npm run dev)
    const response = await fetch(document);
    text = await response.text();
  }

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 250,
    chunkOverlap: 35,
  });

  const output = await splitter.createDocuments([text]);
  return output;
}

/* Create an embedding from each text chunk.
Store all embeddings and corresponding text in Supabase. */
async function createAndStoreEmbeddings() {
  const chunkData = await splitDocument("movies.txt");

  const embeddingResponse = await openai.embeddings.create({
    model: "nvidia/llama-nemotron-embed-vl-1b-v2:free",
    input: chunkData.map((chunk) => chunk.pageContent),
  });

  const data = chunkData.map((chunk, i) => ({
    content: chunk.pageContent,
    embedding: embeddingResponse.data[i].embedding,
  }));

  const { error } = await supabase.from("documents").insert(data);
  if (error) {
    console.error("Error inserting into Supabase:", error);
  } else {
    console.log("SUCCESS! Embeddings created and stored in Supabase.");
  }

  // console.log(data)
}

createAndStoreEmbeddings();

/**
 # Scrimba did it like this, provided below:
import { openai, supabase } from './config.js';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

# Split movies.txt into text chunks.
# Return LangChain's "output" – the array of Document objects.
async function splitDocument(document) {
  const response = await fetch(document);
  const text = await response.text();
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 250,
    chunkOverlap: 35,
  });
  const output = await splitter.createDocuments([text]);
  return output;
}

# Create an embedding from each text chunk.
# Store all embeddings and corresponding text in Supabase.
async function createAndStoreEmbeddings() {
  const chunkData = await splitDocument("movies.txt");
  const data = await Promise.all(
    chunkData.map(async (chunk) => {
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: chunk.pageContent
      });
      return { 
        content: chunk.pageContent, 
        embedding: embeddingResponse.data[0].embedding 
      }
    })
  );
  await supabase.from('movies').insert(data);
  console.log('SUCCESS!');
}
createAndStoreEmbeddings();
 */
