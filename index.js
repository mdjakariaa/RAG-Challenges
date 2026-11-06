import { supabase } from "./config.js";
import { pipeline } from "@huggingface/transformers";

// Query about our movie data
const query = "tell me about Top Gun drama";
main(query);

async function main(input) {
  try {
    const embedding = await createEmbedding(input);
    const match = await findNearestMatch(embedding);
    await getChatCompletion(match, input);
  } catch (error) {
    console.error("Error in main function.", error);
  }
}

// Create an embedding vector representing the query
async function createEmbedding(input) {
  const embedder = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2",
    {
      device: "cpu",
      dtype: "q8",
    },
  );

  const embeddingResponse = await embedder(input, {
    pooling: "mean",
    normalize: true,
  });

  return embeddingResponse.tolist()[0];
}

// Query Supabase and return semantically matching text chunks
async function findNearestMatch(embedding) {
  const { data, error } = await supabase.rpc("match_movies", {
    query_embedding: embedding,
    match_threshold: 0.5,
    match_count: 2,
  });

  if (error) {
    throw new Error(error.message);
  }

  // // Manage multiple returned matches
  const match = (data ?? []).map((obj) => obj.content).join("\n");
  return match;
}

// Use Hugging Face to make the response conversational
const chatMessages = [
  {
    role: "system",
    content: `You are an enthusiastic movie expert who loves recommending movies to people. You will be given two pieces of information - some context about movies and a question. Your main job is to formulate a short answer to the question using the provided context. If you are unsure and cannot find the answer in the context, say, "Sorry, I don't know the answer." Please do not make up the answer.`,
  },
];

async function getChatCompletion(text, query) {
  if (!text.trim()) {
    console.log("Sorry, I don't know the answer.");
    return;
  }

  chatMessages.push({
    role: "user",
    content: `Context: ${text} Question: ${query}`,
  });

  // Load free Hugging Face conversational model locally
  const generator = await pipeline(
    "text-generation",
    "HuggingFaceTB/SmolLM2-360M-Instruct",
    {
      device: "cpu",
      dtype: "q4",
    },
  );

  const response = await generator(chatMessages, {
    max_new_tokens: 150,
    do_sample: false,
  });

  console.log(response[0].generated_text.at(-1).content);
}






// below program is using OpenRouter free models but the upper code is using HuggingFace models. we can use either of them.

// import { openai, supabase } from "./config.js";

// // Query about our movie data
// const query = "Which movies can I take my child to?";
//// const query = "What's the highest rated movie?";
// main(query);

// async function main(input) {
//   try {
//     const embedding = await createEmbedding(input);
//     const match = await findNearestMatch(embedding);
//     await getChatCompletion(match, input);
//   } catch (error) {
//     console.error("Error in main function.", error);
//   }
// }

// // Create an embedding vector representing the query
// async function createEmbedding(input) {
//   const embeddingResponse = await openai.embeddings.create({
//     model: "nvidia/nemotron-3-embed-1b:free",
//     input,
//   });
//   return embeddingResponse.data[0].embedding;
// }

// /*
//   Challenge: Return and manage multiple matches
//     - Return at least 3 matches from the database table
//     - Combine all of the matching text into 1 string
// */

// // Query Supabase and return a semantically matching text chunk
// async function findNearestMatch(embedding) {
//   const { data } = await supabase.rpc("match_movies", {
//     query_embedding: embedding,
//     match_threshold: 0.5,
//     match_count: 4,
//   });

//   // Manage multiple returned matches
//   const match = data.map((obj) => obj.content).join("\n");
//   return match;
// }

// // Use OpenAI to make the response conversational
// const chatMessages = [
//   {
//     role: "system",
//     content: `You are an enthusiastic movie expert who loves recommending movies to people. You will be given two pieces of information - some context about movies and a question. Your main job is to formulate a short answer to the question using the provided context. If you are unsure and cannot find the answer in the context, say, "Sorry, I don't know the answer." Please do not make up the answer.`,
//   },
// ];

// async function getChatCompletion(text, query) {
//   chatMessages.push({
//     role: "user",
//     content: `Context: ${text} Question: ${query}`,
//   });

//   const response = await openai.chat.completions.create({
//     model: "nvidia/nemotron-3-ultra-550b-a55b:free",
//     messages: chatMessages,
//     temperature: 0.5,
//     frequency_penalty: 0.5,
//   });
//   console.log(response.choices[0].message.content);
// }
