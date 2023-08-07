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
      top_p: restoredParams?.top_p ?? 1,
      stop_pequences: restoredParams?.stop ?? [],
      messages: restoredParams?.messages ?? getDefaultMessagesForMode(restoredMode ?? defaultMode),
      frequency_penalty: restoredParams?.frequency_penalty ?? 0,
      presence_penalty: restoredParams?.presence_penalty ?? 0,
      max_tokens: restoredParams?.max_tokens ?? "",
      stream: restoredParams?.stream ?? false,
    } as z.infer<typeof schema>,
    validate: zodResolver(schema),
  });

  const handleSubmit = useCallback(
    async (values: z.infer<typeof schema>) => {
      setStatus("loading");

      const model = models.find((m) => m.id === values.model);
      if (!model) throw new Error(`Model ${values.model} not found`);

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
            model: model.model,
            messages: mode === "complete" ? [values.messages[0]] : values.messages,
            parameters: {
              temperature: values.temperature,
              top_p: values.top_p,
              stop: values.stop_pequences,
              frequency_penalty: values.frequency_penalty,
              presence_penalty: values.presence_penalty,
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              max_tokens: values.max_tokens || undefined,
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
        model: model.model,
        messages: mode === "complete" ? [values.messages[0]] : values.messages,
        parameters: {
          temperature: values.temperature,
          top_p: values.top_p,
          stop: values.stop_pequences,
          frequency_penalty: values.frequency_penalty,
          presence_penalty: values.presence_penalty,
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          max_tokens: values.max_tokens || undefined,
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
    [form, mode, models]
  );

  // persist state to local storage
  useEffect(() => {
    local.playground.mode.set(mode);
  }, [mode]);
  useEffect(() => {
    local.playground[mode].set({
      model: form.values.model,
      messages: form.values.messages,
      temperature: form.values.temperature,
      top_p: form.values.top_p,
      stop: form.values.stop_pequences,
      frequency_penalty: form.values.frequency_penalty,
      presence_penalty: form.values.presence_penalty,
      max_tokens: form.values.max_tokens as number | undefined,
      stream: form.values.stream,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);

  // restore state on mode change
  const handleChangeMode = useCallback((value: Mode) => setMode(value), []);
  useEffect(() => {
    const params = local.playground[mode].get();
    form.setValues({ ...form.values, ...params });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // set first model as default if not set
  useEffect(() => {
    if (form.values.model === "" && models.length > 0) {
      form.setFieldValue("model", models[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values.model, models]);

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
