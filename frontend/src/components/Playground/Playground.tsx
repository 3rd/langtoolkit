import { useCallback, useMemo, useState } from "react";
import { ScrollArea, Box, Stack, Flex, Text, Select, TextInput, Button, Group } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { ChatInput, ChatInputProps } from "../ChatInput";
import { nanoid } from "nanoid";
import { CompletionInput } from "../CompletionInput";
import { IconFileText, IconMessageChatbot } from "@tabler/icons-react";

const modes = [
  { value: "complete", label: "Complete", icon: <IconFileText /> },
  { value: "chat", label: "Chat", icon: <IconMessageChatbot /> },
];

const models = [
  { value: "gpt-4", label: "gpt-4" },
  { value: "gpt-3.5-turbo-16k", label: "gpt-3.5-turbo-16k" },
  { value: "gpt-3.5-turbo", label: "gpt-3.5-turbo" },
];

const schema = z.object({
  mode: z.string(),
  model: z.string(),
  temperature: z.coerce.number().min(0).max(1).optional(),
  topP: z.coerce.number().min(0).max(1).optional(),
  maxTokens: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.union([z.literal(""), z.coerce.number().min(1)]).optional()
  ),
  stopSequences: z.array(z.string()),
  frequencyPenalty: z.coerce.number().min(0).max(2).optional(),
  presencePenalty: z.coerce.number().min(0).max(2).optional(),
  messages: z.array(
    z.object({
      id: z.string(),
      role: z.string(),
      text: z.string(),
    })
  ),
});

export interface PlaygroundProps {
  roles: string[];
}

export const Playground = ({ roles }: PlaygroundProps) => {
  const form = useForm({
    initialValues: {
      mode: modes[0]?.value ?? "",
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
  const [newStopSequence, setNewStopSequence] = useState("");

  // useDebugRender({ newStopSequence });

  const handleAddStopSequence = () => {
    if (!newStopSequence) return;
    form.setFieldValue("stopSequences", [...form.values.stopSequences, newStopSequence]);
    setNewStopSequence("");
  };

  const handleRemoveStopSequence = (index: number) =>
    form.setFieldValue(
      "stopSequences",
      form.values.stopSequences.filter((_, i) => i !== index)
    );

  const handleCompletionInput = useCallback(
    (value: string) => {
      form.setFieldValue("messages", [{ id: nanoid(), role: roles[0], text: value }]);
    },
    [form, roles]
  );

  const handleSubmit = (values: z.infer<typeof schema>) => {
    console.log(schema.parse(values));
  };

  // TODO: UX - only keep the first message when switching from chat to complete?
  // request user confirmation?
  // could keep the rest of the messages but not use them in the call
  const promptInput = useMemo(() => {
    if (form.values.mode === "complete") {
      return (
        <>
          <CompletionInput value={form.values.messages[0]?.text ?? ""} onChange={handleCompletionInput} />
        </>
      );
    }

    const handleChangeMessage = (message: ChatInputProps["messages"][number]) => {
      const updatedMessages = form.values.messages.map((m) => (m.id === message.id ? message : m));
      form.setFieldValue("messages", updatedMessages);
    };
    const handleDeleteMessage = (messageId: string) => {
      const updatedMessages = form.values.messages.filter((m) => m.id !== messageId);
      form.setFieldValue("messages", updatedMessages);
    };
    const handleNewMessage = () => {
      const updatedMessages = [...form.values.messages, { id: nanoid(), role: roles[0], text: "" }];
      form.setFieldValue("messages", updatedMessages);
    };

    if (form.values.mode === "chat") {
      return (
        <ChatInput
          messages={form.values.messages}
          roles={roles}
          onChangeMessage={handleChangeMessage}
          onDeleteMessage={handleDeleteMessage}
          onNewMessage={handleNewMessage}
        />
      );
    }
    return null;
  }, [form, handleCompletionInput, roles]);

  return (
    <Stack sx={{ flex: 1, overflow: "hidden", height: "100%", paddingBottom: "2rem" }}>
      {/* content */}
      <form style={{ display: "flex", flex: 1, overflow: "hidden" }} onSubmit={form.onSubmit(handleSubmit)}>
        <Flex gap="md" sx={{ flex: 1 }}>
          {/* left */}
          <Stack sx={{ flex: 1 }}>
            <ScrollArea
              styles={(theme) => ({
                root: {
                  flex: 1,
                  border:
                    theme.colorScheme === "dark"
                      ? `1px solid ${theme.colors.gray[8]}`
                      : `1px solid ${theme.colors.gray[4]}`,
                  borderRadius: theme.radius.sm,
                  paddingTop: theme.spacing.sm,
                  paddingBottom: theme.spacing.sm,
                },
                viewport: {
                  height: "100%",
                  "& > div": {
                    height: "100%",
                  },
                },
              })}
            >
              {promptInput}
            </ScrollArea>

            {/* actions */}
            <Flex gap="md">
              <Button color="blue" type="submit">
                Submit
              </Button>
              <Button color="red" onClick={form.reset}>
                Reset
              </Button>
            </Flex>
          </Stack>

          {/* right */}
          <Box>
            <Stack>
              {/* mode */}
              <Select data={modes} label="Mode" placeholder="Complete" {...form.getInputProps("mode")} />
              {/* <SegmentedControl */}
              {/*   data={modes.map((mode) => ({ */}
              {/*     value: mode.value, */}
              {/*     label: ( */}
              {/*       <Center> */}
              {/*         {mode.icon} */}
              {/*         <Box ml={10}>{mode.label}</Box> */}
              {/*       </Center> */}
              {/*     ), */}
              {/*   }))} */}
              {/*   size="sm" */}
              {/*   value={form.values.mode} */}
              {/*   onChange={(value) => form.setFieldValue("mode", value)} */}
              {/* /> */}

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
                <Select data={models} label="Model" placeholder="gpt-4" {...form.getInputProps("model")} />

                {/* temp & top p */}
                <Group position="apart" spacing="sm">
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
                    {...form.getInputProps("topP")}
                  />
                </Group>

                {/* max tokens */}
                <TextInput
                  label="Max. tokens"
                  min={0}
                  placeholder="Infinity"
                  sx={{ flex: 1 }}
                  type="number"
                  {...form.getInputProps("maxTokens")}
                />

                {/* frequency & presence penalty */}
                <Group position="apart" spacing="sm">
                  {/* frequency penalty */}
                  <TextInput
                    label="Frequency penalty"
                    max={2}
                    min={0}
                    placeholder="0"
                    step={0.01}
                    sx={{ flex: 1 }}
                    type="number"
                    {...form.getInputProps("frequencyPenalty")}
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
                    {...form.getInputProps("presencePenalty")}
                  />
                </Group>

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
                {form.values.stopSequences.length > 0 && (
                  <Stack p="sm" spacing="none">
                    {form.values.stopSequences.map((item, index) => (
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
          </Box>
        </Flex>
      </form>
    </Stack>
  );
};
