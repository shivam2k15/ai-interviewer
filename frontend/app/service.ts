type ChatApiResponse = {
  answer?: string;
  error?: string;
};

const apiBaseUrl =
  process.env.NEXT_PUBLIC_BUN_API_URL ?? "http://localhost:3001";

export async function getChatResponse(prompt: string): Promise<string> {
  const response = await fetch(`${apiBaseUrl}/api/interview`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: prompt }),
  });

  const data = (await response.json()) as ChatApiResponse;

  if (!response.ok) {
    throw new Error(data.error ?? "Request failed");
  }

  if (!data.answer) {
    throw new Error("Invalid response from server");
  }
  return data.answer;
}
