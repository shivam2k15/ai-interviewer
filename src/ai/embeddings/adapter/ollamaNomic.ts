const getEmbeddings = async (text: String) => {
  const response = await fetch(process.env.EMBEDDING_BASE_URL ?? "", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.EMBEDDING_OLLAMA_MODEL,
      prompt: text,
    }),
  });

  const data = (await response.json()) as {
    embedding: number[];
  };
  return data?.embedding;
};

export default getEmbeddings;
