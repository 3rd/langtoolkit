import { useCallback, useEffect, useState } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { nanoid } from "nanoid";
import { z } from "zod";
import { complete } from "@/api";
import { Playground, PlaygroundStatus, schema } from "@/components/Playground";
import { local } from "@/storage";
import { Mode } from "@/types";
import { useModels } from "@/api/models";

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

const modelOptions = { enabled: true, available: true };

export const PlaygroundPage = () => {
  const [mode, setMode] = useState<Mode>(restoredMode ?? defaultMode);
  const [status, setStatus] = useState<PlaygroundStatus>("idle");
  const [lastMeta, setLastMeta] = useState<{ id: string; elapsedSeconds: number } | null>(null);
  const [models] = useModels(modelOptions);

  const form = useForm({
    initialValues: {
      mode: restoredMode ?? defaultMode,
      model: restoredParams?.model ?? models[0]?.id ?? "",
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
    [form, mode]
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);

  // reset on mode change
  useEffect(() => {
    const params = local.playground[mode].get();
    form.setValues({
      ...form.values,
      ...params,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const handleChangeMode = useCallback((value: Mode) => {
    setMode(value);
  }, []);

  return (
    <Playground
      form={form}
      lastMeta={lastMeta}
      mode={mode}
      models={models}
      roles={roles}
      status={status}
      onChangeMode={handleChangeMode}
      onSubmit={handleSubmit}
    />
  );
};
