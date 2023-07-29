import { complete } from "@/api";
import { Playground, PlaygroundModel, PlaygroundStatus, schema } from "@/components/Playground";
import { useState } from "@/utils/useDebugRender.bkp-web2";
import { useForm, zodResolver } from "@mantine/form";
import { nanoid } from "nanoid";
import { useCallback } from "react";
import { z } from "zod";

const models: PlaygroundModel[] = [
  { value: "gpt-4", label: "gpt-4" },
  { value: "gpt-3.5-turbo-16k", label: "gpt-3.5-turbo-16k" },
  { value: "gpt-3.5-turbo", label: "gpt-3.5-turbo" },
];

const roles = ["system", "assistant", "user"];

export const PlaygroundPage = () => {
  const [status, setStatus] = useState<PlaygroundStatus>("idle");

  const form = useForm({
    initialValues: {
      mode: "complete",
      model: models[0]?.value ?? "",
      temperature: 0.75,
      topP: 1,
      stopSequences: [],
      messages: [{ id: nanoid(), role: roles[0], text: "" }],
      frequencyPenalty: 0,
      presencePenalty: 0,
      maxTokens: "",
    } as z.infer<typeof schema>,
    validate: zodResolver(schema),
  });

  const handleSubmit = useCallback(
    async (values: z.infer<typeof schema>) => {
      setStatus("loading");
      const response = await complete.complete({
        vendor: "openai",
        model: values.model,
        messages: values.mode === "complete" ? [values.messages[0]] : values.messages,
        parameters: {
          temperature: values.temperature,
          topP: values.topP,
          stop: values.stopSequences,
          frequencyPenalty: values.frequencyPenalty,
          presencePenalty: values.presencePenalty,
          maxTokens: values.maxTokens || undefined,
        },
      });

      const message = {
        id: response.id,
        role: "system",
        text: response.text,
      };

      if (values.messages[1]?.role === "system") {
        form.setFieldValue("messages.1", message);
      } else {
        form.insertListItem("messages", message, 1);
      }

      setStatus("idle");
    },
    [form]
  );

  return <Playground roles={roles} form={form} status={status} models={models} onSubmit={handleSubmit} />;
};
