import { useMemo, useState } from "react";
import {
  Stack,
  Flex,
  Text,
  Select,
  TextInput,
  Button,
  Group,
  Textarea,
  CopyButton,
  Tooltip,
  ActionIcon,
  Switch,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { z } from "zod";
import { nanoid } from "nanoid";
import { IconCheck, IconCopy, IconFileText, IconMessageChatbot } from "@tabler/icons-react";
import { ChatInput } from "../ChatInput";
import { CompletionInput } from "../CompletionInput";
import { Message, Mode, Model } from "@/types";
import { NShotInput } from "../NShotInput";

const modes = [
  { value: "complete", label: "Complete", icon: <IconFileText /> },
  { value: "chat", label: "Chat", icon: <IconMessageChatbot /> },
  { value: "nshot", label: "N-Shot", icon: <IconMessageChatbot /> },
];

export const schema = z.object({
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

export type PlaygroundStatus = "error" | "idle" | "loading";
export type PlaygroundRequest = z.infer<typeof schema>;

export interface PlaygroundProps {
  mode: Mode;
  models: Model[];
  roles: string[];
  form: UseFormReturnType<z.infer<typeof schema>>;
  lastMeta?: { id: string; elapsedSeconds: number } | null;
  status?: PlaygroundStatus;
  onSubmit?: (values: PlaygroundRequest) => void;
  onChangeMode?: (mode: Mode) => void;
}

export const Playground = ({
  form,
  models,
  status,
  onSubmit,
  roles,
  lastMeta,
  mode,
  onChangeMode,
}: PlaygroundProps) => {
  const [newStopSequence, setNewStopSequence] = useState("");

  // param handlers
  const handleAddStopSequence = () => {
    if (!newStopSequence) return;
    form.setFieldValue("stopSequences", [...form.values.stop_pequences, newStopSequence]);
    setNewStopSequence("");
  };
  const handleRemoveStopSequence = (index: number) =>
    form.setFieldValue(
      "stopSequences",
      form.values.stop_pequences.filter((_, i) => i !== index)
    );

  // form handlers
  const handleSubmit = (values: z.infer<typeof schema>) => {
    if (status === "loading") return;
    onSubmit?.(schema.parse(values));
  };

  // input handlers
  const handleChange = (value: Message[]) => form.setFieldValue("messages", value);
  const handleClear = () => form.setFieldValue("messages", [{ id: nanoid(), role: roles[0], text: "" }]);

  // getters
  const lastMessage = form.values.messages[form.values.messages.length - 1];
  const isSubmitDisabled =
    (mode === "chat" && lastMessage.role === "assistant") || (mode === "nshot" && lastMessage.role === "system");

  const outputArea = useMemo(() => {
    if (mode !== "complete") return null;
    if (form.values.messages.length < 2 || form.values.messages[1].role !== "system") return null;

    const value = form.values.messages[1].text;

    return (
      <Textarea
        label="Output"
        rightSection={
          <CopyButton timeout={2000} value={value}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? "Copied" : "Copy"} position="right" withArrow>
                <ActionIcon color={copied ? "teal" : "gray"} onClick={copy}>
                  {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        }
        rightSectionProps={{
          style: { bottom: "auto", top: "0", transform: "translateY(calc(-100% - 2px))", zIndex: 1 },
        }}
        styles={{
          root: { display: "flex", flexDirection: "column", flex: 1 },
          wrapper: { display: "flex", flexDirection: "column", flex: 1 },
          input: { flex: 1 },
        }}
        value={value}
        readOnly
      />
    );
  }, [form, mode]);

  return (
    <Stack sx={{ flex: 1, height: "100%", paddingBottom: "2rem" }}>
      {/* content */}
      <form style={{ display: "flex", flex: 1, overflow: "auto" }} onSubmit={form.onSubmit(handleSubmit)}>
        <Flex gap="md" sx={{ flex: 1 }}>
          {/* left */}
          <Stack p="xs" sx={{ flex: 1 }}>
            {/* input */}
            {mode === "complete" && <CompletionInput value={form.values.messages} onChange={handleChange} />}
            {mode === "chat" && <ChatInput roles={roles} value={form.values.messages} onChange={handleChange} />}
            {mode === "nshot" && <NShotInput value={form.values.messages} onChange={handleChange} />}

            {/* output */}
            {outputArea}

            {/* footer */}
            <Flex align="center" gap="md" justify="space-between">
              {/* actions */}
              <Flex gap="md">
                <Button color="blue" disabled={isSubmitDisabled} loading={status === "loading"} type="submit">
                  Submit
                </Button>
                <Button color="red" onClick={handleClear}>
                  Clear
                </Button>
              </Flex>

              {/* meta */}
              {status !== "loading" && lastMeta && (
                <Flex gap="xs">
                  <Text color="gray" size="xs">
                    #{lastMeta.id} ({lastMeta.elapsedSeconds.toFixed(2)}s)
                  </Text>
                </Flex>
              )}
            </Flex>
          </Stack>

          {/* right */}
          <Stack p="xs">
            {/* mode */}
            <Select data={modes} label="Mode" placeholder="Complete" value={mode} onChange={onChangeMode} />

            {/* A/B testable options */}
            <Stack
              sx={(theme) => ({
                border:
                  theme.colorScheme === "dark"
                    ? `1px solid ${theme.colors.gray[8]}`
                    : `1px solid ${theme.colors.gray[4]}`,
                borderRadius: theme.radius.sm,
                gap: theme.spacing.md,
                padding: theme.spacing.sm,
              })}
            >
              {/* model */}
              <Select
                data={models.map((model) => ({ value: model.id, label: model.model }))}
                label="Model"
                placeholder=""
                {...form.getInputProps("model")}
              />

              {/* stream */}
              <Switch checked={form.values.stream} label="Stream response" {...form.getInputProps("stream")} />

              {/* temp & top p */}
              <Flex gap="sm">
                {/* temperature */}
                <TextInput
                  label="Temperature"
                  max={1}
                  min={0}
                  placeholder="1"
                  step={0.01}
                  sx={{ flex: 1 }}
                  type="number"
                  {...form.getInputProps("temperature")}
                />

                {/* top p */}
                <TextInput
                  label="Top P"
                  max={1}
                  min={0}
                  placeholder="1"
                  step={0.01}
                  sx={{ flex: 1 }}
                  type="number"
                  {...form.getInputProps("top_p")}
                />
              </Flex>

              {/* max tokens */}
              <TextInput
                label="Max. tokens"
                min={0}
                placeholder="Infinity"
                sx={{ flex: 1 }}
                type="number"
                {...form.getInputProps("max_tokens")}
              />

              {/* frequency & presence penalty */}
              <Flex gap="sm">
                {/* frequency penalty */}
                <TextInput
                  label="Frequency penalty"
                  max={2}
                  min={0}
                  placeholder="0"
                  step={0.01}
                  sx={{ flex: 1 }}
                  type="number"
                  {...form.getInputProps("frequency_penalty")}
                />

                {/* presence penalty */}
                <TextInput
                  label="Presence penalty"
                  max={2}
                  min={0}
                  placeholder="0"
                  step={0.01}
                  sx={{ flex: 1 }}
                  type="number"
                  {...form.getInputProps("presence_penalty")}
                />
              </Flex>

              {/* stop sequences */}
              <Group position="apart" spacing="sm" sx={{ flex: 1, alignItems: "flex-end" }}>
                <TextInput
                  label="Stop sequences"
                  placeholder="Add stop sequence"
                  value={newStopSequence}
                  onChange={(event) => setNewStopSequence(event.currentTarget.value)}
                />
                <Button color="gray" disabled={!newStopSequence} variant="outline" onClick={handleAddStopSequence}>
                  Add
                </Button>
              </Group>
              {form.values.stop_pequences.length > 0 && (
                <Stack p="sm" spacing="none">
                  {form.values.stop_pequences.map((item, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Flex key={`${item}-${index}`} sx={{ display: "flex", flex: 1, justifyContent: "space-between" }}>
                      <Text sx={{ flex: 1 }}>&quot;{item}&quot;</Text>
                      <Button color="red" variant="subtle" compact onClick={() => handleRemoveStopSequence(index)}>
                        Remove
                      </Button>
                    </Flex>
                  ))}
                </Stack>
              )}
            </Stack>
          </Stack>
        </Flex>
      </form>
    </Stack>
  );
};
