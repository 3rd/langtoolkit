import { http } from ".";

type CompleteRequest = {
  vendor: string;
  model: string;
  messages: {
    role: string;
    text: string;
  }[];
  parameters?: {
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    presencePenalty?: number;
    frequencyPenalty?: number;
    stop?: string[];
  };
};

type CompleteResponse = {
  id: string;
  text: string;
};

const complete = async (request: CompleteRequest): Promise<CompleteResponse> => {
  const response = await http("complete", {
    method: "POST",
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error(`Request failed: ${response.statusText}`);
  return response.json();
};

export { complete };
