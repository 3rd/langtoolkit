import { useCallback, useEffect, useState } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { nanoid } from "nanoid";
import { z } from "zod";
import { complete } from "@/api";
import { Playground, PlaygroundModel, PlaygroundStatus, schema } from "@/components/Playground";
import { local } from "@/storage";
import { Mode } from "@/types";

const models: PlaygroundModel[] = [
  { value: "gpt-3.5-turbo", label: "gpt-3.5-turbo" },
  { value: "gpt-3.5-turbo-16k", label: "gpt-3.5-turbo-16k" },
  { value: "gpt-4", label: "gpt-4" },
];

const roles = ["system", "assistant", "user"];

const defaultMode = "complete";
const restoredMode = local.playground.mode.get();
const restoredParams = local.playground[restoredMode ?? defaultMode].get();

const getDefaultMessagesForMode = (mode: Mode) => {
  if (mode === "nshot") {
    return [
      { id: nanoid(), role: "system", text: "" },
      { id: nanoid(), role: "user", text: "" },
      { id: nanoid(), role: "assistant", text: "" },
    ];
  }
  return [{ id: nanoid(), role: "system", text: "" }];
};

export const PlaygroundPage = () => {
  const [mode, setMode] = useState<Mode>(restoredMode ?? defaultMode);
  const [status, setStatus] = useState<PlaygroundStatus>("idle");
  const [lastMeta, setLastMeta] = useState<{ id: string; elapsedSeconds: number } | null>(null);

  const form = useForm({
    initialValues: {
      mode: restoredMode ?? defaultMode,
      model: restoredParams?.model ?? models[0]?.value ?? "",
      temperature: restoredParams?.temperature ?? 0.75,
      topP: restoredParams?.topP ?? 1,
      stopSequences: restoredParams?.stop ?? [],
      messages: restoredParams?.messages ?? getDefaultMessagesForMode(restoredMode ?? defaultMode),
      frequencyPenalty: restoredParams?.frequencyPenalty ?? 0,
      presencePenalty: restoredParams?.presencePenalty ?? 0,
      maxTokens: restoredParams?.maxTokens ?? 64,
      stream: restoredParams?.stream ?? false,
    } as z.infer<typeof schema>,
    validate: zodResolver(schema),
  });

  const handleSubmit = useCallback(
    async (values: z.infer<typeof schema>) => {
      setStatus("loading");

      // streaming
      if (values.stream) {
        let output = "";

        const role = mode === "complete" ? "system" : "assistant";
        const message = { id: nanoid(), role, text: "" };
        const messageIndex = mode === "complete" ? 1 : form.values.messages.length;
        let messageIsInserted = false;

        await complete.stream(
          {
            vendor: "openai",
            model: values.model,
            messages: mode === "complete" ? [values.messages[0]] : values.messages,
            parameters: {
              temperature: values.temperature,
              topP: values.topP,
              stop: values.stopSequences,
              frequencyPenalty: values.frequencyPenalty,
              presencePenalty: values.presencePenalty,
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              maxTokens: values.maxTokens || undefined,
            },
          },
          (chunk) => {
            if (typeof chunk === "string") {
              output += chunk;
              message.text = output;

              if (!messageIsInserted && form.values.messages.length - 1 < messageIndex) {
                form.insertListItem("messages", message);
                messageIsInserted = true;
              }

              form.setFieldValue(`messages.${messageIndex}`, message);
            } else {
              setLastMeta({ id: chunk.id, elapsedSeconds: chunk.elapsedSeconds });
            }
          }
        );

        setStatus("idle");
        return;
      }

      // regular completion
      const response = await complete.complete({
        vendor: "openai",
        model: values.model,
        messages: mode === "complete" ? [values.messages[0]] : values.messages,
        parameters: {
          temperature: values.temperature,
          topP: values.topP,
          stop: values.stopSequences,
          frequencyPenalty: values.frequencyPenalty,
          presencePenalty: values.presencePenalty,
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          maxTokens: values.maxTokens || undefined,
        },
      });

      if (mode === "complete") {
        form.setFieldValue("messages.1", { id: response.id, role: "system", text: response.text });
      } else {
        form.insertListItem("messages", { id: response.id, role: "assistant", text: response.text });
      }

      setLastMeta({ id: response.id, elapsedSeconds: response.elapsedSeconds });

      setStatus("idle");
    },
    [form]
  );

  // persist state to local storage
  useEffect(() => {
    local.playground.mode.set(mode);
  }, [mode]);
  useEffect(() => {
    local.playground[mode].set({
      model: form.values.model,
      temperature: form.values.temperature,
      topP: form.values.topP,
      stop: form.values.stopSequences,
      messages: form.values.messages,
      frequencyPenalty: form.values.frequencyPenalty,
      presencePenalty: form.values.presencePenalty,
      maxTokens: form.values.maxTokens as number | undefined,
      stream: form.values.stream,
    });
  }, [form.values]);

  // reset on mode change
  useEffect(() => {
    const restoredParams = local.playground[mode].get();
    form.setValues({
      ...form.values,
      ...restoredParams,
    });
  }, [mode]);

  const handleChangeMode = useCallback((mode: Mode) => {
    setMode(mode);
  }, []);

  return (
    <Playground
      mode={mode}
      onChangeMode={handleChangeMode}
      form={form}
      models={models}
      roles={roles}
      status={status}
      onSubmit={handleSubmit}
      lastMeta={lastMeta}
    />
  );
};
