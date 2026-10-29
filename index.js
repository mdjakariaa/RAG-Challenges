import openai from "./config.js";

const content = [
  "Beyond Mars: speculating life on distant planets.",
  "Jazz under stars: a night in New Orleans' music scene.",
  "Mysteries of the deep: exploring uncharted ocean caves.",
  "Rediscovering lost melodies: the rebirth of vinyl culture.",
  "Tales from the tech frontier: decoding AI ethics.",
];

/** Create embeddings representing the input text */
async function main() {
  const embedding = await openai.embeddings.create({
    model: "nvidia/nemotron-3.5-embed-1b:free",
    input: content,
  });

  /*
    Challenge: Pair text with its embedding
      - For each text input, create an object with 
        a 'content' and 'embedding' property
      - The value of 'content' should be the text
      - The value of 'embedding' should be the vector embedding for that text
  */
  const data = content.map((text, i) => ({
    content: text,
    embedding: embedding.data[i].embedding,
  }));

  console.log(data);
}
main();


/**
 # Scrimba did it like this, that is provided below, and they said codes of you and me can be different but the output is same, so its totally ok.
 async function main(input) {
  await Promise.all(
    input.map( async(textChunk) => {
        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: textChunk,
        });
        const data = { content: textChunk, embedding: embeddingResponse.data[0].embedding }
        console.log(data);  
    })    
  );
  console.log('Embedding complete!');
}
main(content);
 */
