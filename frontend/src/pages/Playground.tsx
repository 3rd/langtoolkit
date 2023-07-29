import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { nanoid } from "nanoid";
import { z } from "zod";
import { complete } from "@/api";
import { Playground, PlaygroundModel, PlaygroundStatus, schema } from "@/components/Playground";

const models: PlaygroundModel[] = [
  { value: "gpt-3.5-turbo", label: "gpt-3.5-turbo" },
  { value: "gpt-3.5-turbo-16k", label: "gpt-3.5-turbo-16k" },
  { value: "gpt-4", label: "gpt-4" },
];

const roles = ["system", "assistant", "user"];

// TODO: playground persistence with state stored per-mode
// playgroundHistory: { complete: {...}, chat: {...} }
const storeMessages = (messages: { id: string; role: string; text: string }[]) => {
  localStorage.setItem("messages", JSON.stringify(messages));
};
const getMessages = () => {
  const serializedMessages = localStorage.getItem("messages");
  if (!serializedMessages) return null;
  try {
    return JSON.parse(serializedMessages) as z.infer<typeof schema>["messages"];
  } catch {}
  return null;
};

export const PlaygroundPage = () => {
  const [status, setStatus] = useState<PlaygroundStatus>("idle");

  const form = useForm({
    initialValues: {
      mode: "chat",
      model: models[0]?.value ?? "",
      temperature: 0.75,
      topP: 1,
      stopSequences: [],
      messages: getMessages() ?? [{ id: nanoid(), role: roles[0], text: "" }],
      frequencyPenalty: 0,
      presencePenalty: 0,
      maxTokens: 500,
      stream: true,
    } as z.infer<typeof schema>,
    validate: zodResolver(schema),
  });

  const handleSubmit = useCallback(
    async (values: z.infer<typeof schema>) => {
      setStatus("loading");

      // streaming
      if (values.stream) {
        let output = "";

        const role = form.values.mode === "complete" ? "system" : "assistant";
        const message = { id: nanoid(), role, text: "" };
        let messageIndex = form.values.mode === "complete" ? 1 : form.values.messages.length;
        let messageIsInserted = false;

        await complete.stream(
          {
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
          },
          (chunk: string) => {
            output += chunk;
            message.text = output;

            if (!messageIsInserted && form.values.messages.length - 1 < messageIndex) {
              form.insertListItem("messages", message);
              messageIsInserted = true;
            }

            form.setFieldValue(`messages.${messageIndex}`, message);
          }
        );

        setStatus("idle");
        return;
      }

      // regular completion
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

      const role = form.values.mode === "complete" ? "system" : "assistant";
      const message = { id: response.id, role, text: response.text };

      if (role === "system") {
        if (values.messages[1]?.role === "system") {
          form.setFieldValue("messages.1", message);
        } else {
          form.insertListItem("messages", message, 1);
        }
      } else {
        form.insertListItem("messages", message);
      }

      setStatus("idle");
    },
    [form]
  );

  // local message persistence
  const hasLoadedMessages = useRef(false);
  useEffect(() => {
    const messages = getMessages();
    if (messages) form.setFieldValue("messages", messages);
    hasLoadedMessages.current = true;
  }, []);
  useEffect(() => {
    if (!hasLoadedMessages.current) return;
    storeMessages(form.values.messages);
  }, [form.values.messages]);

  return <Playground roles={roles} form={form} status={status} models={models} onSubmit={handleSubmit} />;
};
