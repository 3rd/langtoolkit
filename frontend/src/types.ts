export type User = {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar: string | null;
  role: "admin" | "user";
};

export type Settings = {
  models: {
    openai: {
      enabled: boolean;
      apiKey: string;
    };
    anthropic: {
      enabled: boolean;
      apiKey: string;
    };
    custom: {
      id: string;
      url: string;
      payload: string;
      headers: Record<string, string>;
    }[];
  };
};

export type Model = {
  id: string;
  vendor: string;
  model: string;
  enabled: boolean;
  available: boolean;
};

export type Mode = "chat" | "complete" | "nshot";

export type Message = {
  id: string;
  role: string;
  text: string;
};

export type CompletionRequest = {
  vendor: string;
  model: string;
  messages: Message[];
  parameters?: {
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    presence_penalty?: number;
    frequency_penalty?: number;
    stop?: string[];
  };
};

export type CompletionResponse = {
  id: string;
  elapsedSeconds: number;
  text: string;
};

// -------------------- temp --------------------

export type OpenAIMessage =
  | {
      role: "assistant";
      function_call: Readonly<{}>;
    }
  | ({ content: string } & (
      | {
          role: "function";
          name: string;
        }
      | {
          role: "system" | "user";
          name?: string;
        }
    ));

export type OpenAIFunctionParameter = {
  description: string;
} & (
  | {
      type: "array";
      items: OpenAIFunctionParameter;
    }
  | {
      type: "object";
      properties: Record<string, OpenAIFunctionParameter>;
    }
  | {
      type: "string";
    }
);

export type OpenAIFunction = {
  name: string;
  description: string;
  parameters: OpenAIFunctionParameter;
};

export type OpenAIParams = {
  functions?: OpenAIFunction[];
  function_call?: "auto" | "none" | { name: string };
  temperature?: number;
  top_p?: number;
  n?: number;
  stream?: boolean;
  stop?: string[];
  max_tokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  logit_bias?: Record<string, number>;
  user?: string;
};

export type AnthropicParams = {
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  user?: string;
  stream?: boolean;
  stop?: string[];
};
