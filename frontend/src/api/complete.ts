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

const stream = async (request: CompleteRequest, callback: any) => {
  return new Promise<void>((resolve, reject) => {
    http("complete", {
      method: "POST",
      body: JSON.stringify({ ...request, stream: true }),
    })
      .then((response) => {
        if (response.ok && response.body) {
          const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

          const readStream = () => {
            reader.read().then(({ done, value }) => {
              if (value) {
                const lines = value.trim().split("\n");
                for (const line of lines) {
                  try {
                    const data = JSON.parse(line);
                    callback(data);
                  } catch (e) {
                    reject(e);
                  }
                }
              }
              if (done) {
                reader.cancel().catch(() => null);
                resolve();
                return;
              }
              readStream();
            });
          };
          readStream();
        }
      })
      .catch(reject);
  });
};

export { complete, stream };
