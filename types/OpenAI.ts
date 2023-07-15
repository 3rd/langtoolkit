export type OpenAIMessage =
  | {
      role: "assistant";
      function_call: any;
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

export type OpenAIInput = {
  model: string;
  messages: OpenAIMessage[];
  functions?: OpenAIFunction[];
  function_call?: "auto" | "none" | { name: string };
  temperature?: number;
  top_p?: number;
  n?: number;
  stream?: boolean;
  stop?: string[] | string;
  max_tokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  logit_bias?: Record<string, number>;
  user?: string;
};
