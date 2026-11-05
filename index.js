import { supabase } from "./config.js";
import { pipeline } from "@huggingface/transformers";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { readFile } from "node:fs/promises";

/* Split movies.txt into text chunks.
Return LangChain's "output" – the array of Document objects. */
async function splitDocument(document) {
  try {
    // Read directly from disk in Node.js
    const text = await readFile(document, "utf-8");
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 250,
      chunkOverlap: 35,
    });
    const output = await splitter.createDocuments([text]);
    return output;
  } catch (e) {
    console.error("There was an issue with splitting text");
    throw e;
  }
}

/* Create an embedding from each text chunk.
Store all embeddings and corresponding text in Supabase. */
async function createAndStoreEmbeddings() {
  try {
    const chunkData = await splitDocument("movies.txt");

    // Load the free Hugging Face embedding model locally
    const embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
      {
        device: "cpu",
        dtype: "q8",
      },
    );

    const data = await Promise.all(
      chunkData.map(async (chunk) => {
        const embeddingResponse = await embedder(chunk.pageContent, {
          pooling: "mean",
          normalize: true,
        });

        return {
          content: chunk.pageContent,
          embedding: embeddingResponse.tolist()[0],
        };
      }),
    );

    const { error } = await supabase.from("movies").insert(data);
    if (error) {
      throw new Error(
        "Issue inserting data into the database: " + error.message,
      );
    }
    console.log("SUCCESS!");
  } catch (e) {
    console.error("ERRORs: " + e.message);
  }
}

createAndStoreEmbeddings();







// the below codes was using openrouter free models, and the upper code is using the free Hugging Face embedding model. The upper code is more efficient and cost-effective since it does not require API calls to OpenAI or OpenRouter, and it can run locally without any external dependencies.

// import { openai, supabase } from "./config.js";
// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// import { readFile } from "node:fs/promises";

// /* Split movies.txt into text chunks.
// Return LangChain's "output" – the array of Document objects. */
// async function splitDocument(document) {
//   try {
//     // Read directly from disk in Node.js
//     const text = await readFile(document, "utf-8");
//     const splitter = new RecursiveCharacterTextSplitter({
//       chunkSize: 250,
//       chunkOverlap: 35,
//     });
//     const output = await splitter.createDocuments([text]);
//     return output;
//   } catch (e) {
//     console.error("There was an issue with splitting text");
//     throw e;
//   }

// }

// /* Create an embedding from each text chunk.
// Store all embeddings and corresponding text in Supabase. */
// async function createAndStoreEmbeddings() {
//   try {
//     const chunkData = await splitDocument("movies.txt");
//     const data = await Promise.all(
//       chunkData.map(async (chunk) => {
//         const embeddingResponse = await openai.embeddings.create({
//           model: "nvidia/nemotron-3.5-embed-1b:free",
//           input: chunk.pageContent,
//         });
//         return {
//           content: chunk.pageContent,
//           embedding: embeddingResponse.data[0].embedding,
//         };
//       }),
//     );

//     const { error } = await supabase.from("movies").insert(data);
//     if (error) {
//       throw new Error("Issue inserting data into the database.");
//     }
//     console.log("SUCCESS!");
//   } catch (e) {
//     console.error("ERRORs: " + e.message);
//   }
// }
// createAndStoreEmbeddings();
