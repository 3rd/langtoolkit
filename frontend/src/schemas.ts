import { z } from "zod";
import { CompletionRequest } from "./types";

export const completionInputSchema: z.ZodType<Omit<CompletionRequest, "vendor">> = z.object({
  model: z.string(),
  temperature: z.coerce.number().min(0).max(1).optional(),
  top_p: z.coerce.number().min(0).max(1).optional(),
  max_tokens: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.union([z.literal(""), z.coerce.number().min(1)]).optional()
  ),
  stop_pequences: z.array(z.string()),
  frequency_penalty: z.coerce.number().min(0).max(2).optional(),
  presence_penalty: z.coerce.number().min(0).max(2).optional(),
  messages: z.array(
    z.object({
      id: z.string(),
      role: z.string(),
      text: z.string(),
    })
  ),
  stream: z.boolean(),
});
