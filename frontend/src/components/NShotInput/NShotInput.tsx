import { Message } from "@/types";
import { Box, ActionIcon, Flex, ScrollArea, Stack, Textarea, Button } from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { nanoid } from "nanoid";
import { useMemo } from "react";

type NShotSystemPromptInput = {
  value: string;
  onChange: (value: string) => void;
};
const NShotSystemPromptInput = ({ value, onChange }: NShotSystemPromptInput) => {
  return <Textarea label="System prompt" value={value} onChange={(event) => onChange(event.currentTarget.value)} />;
};

type NShotSampleInput = {
  index: number;
  input: Message;
  output: Message;
  onChange: (input: Message, output: Message) => void;
  onDelete: () => void;
};
const NShotSampleInput = ({ index, input, output, onChange, onDelete }: NShotSampleInput) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...input, text: event.currentTarget.value }, output);
  };
  const handleOutputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(input, { ...output, text: event.currentTarget.value });
  };

  return (
    <Flex gap="sm">
      <Textarea label={`Input #${index + 1}`} sx={{ flex: 1 }} value={input.text} onChange={handleInputChange} />
      <Textarea label={`Output #${index + 1}`} sx={{ flex: 1 }} value={output.text} onChange={handleOutputChange} />
      {index !== 0 && (
        <ActionIcon color="gray.7" hidden onClick={onDelete}>
          <IconTrash size={18} />
        </ActionIcon>
      )}
    </Flex>
  );
};

const validateMessages = (messages: Message[]) => {
  if (messages.length < 3) throw new Error(`NShotInput received ${messages.length} messages`);
  for (let i = 1; i < messages.length - 1; i += 2) {
    const [current, next] = [messages[i], messages[i + 1]];
    if (current && current.role !== "user") throw new Error(`Message #${i} is not an assistant message`);
    if (next && next.role !== "assistant") throw new Error(`Message #${i + 1} is not a user message`);
  }
};

export interface NShotInputProps {
  value: Message[];
  onChange: (messages: Message[]) => void;
}

export const NShotInput = ({ value, onChange }: NShotInputProps) => {
  if (value.length === 0) throw new Error(`NShotInput did not receive any messages`);
  validateMessages(value);

  const systemMessage = value[0];
  const sampleMessages = value.slice(1, -2);
  const testMessages = value.slice(-2);

  const handleChangeSystemMessage = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessages = [{ ...systemMessage, text: event.target.value }, ...value.slice(1)];
    onChange(newMessages);
  };
  const handleTestInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessages = [...value.slice(0, -2), { ...testMessages[0], text: event.target.value }, testMessages[1]];
    onChange(newMessages);
  };

  const handleAddSample = () => {
    const newMessages = [
      systemMessage,
      ...sampleMessages,
      { id: nanoid(), role: "user", text: "" },
      { id: nanoid(), role: "assistant", text: "" },
      ...testMessages,
    ];
    onChange(newMessages);
  };

  const samples = useMemo(() => {
    const elements = [];

    for (let i = 0; i < sampleMessages.length; i += 2) {
      const [input, output] = [sampleMessages[i], sampleMessages[i + 1]];

      const handleChange = (newInput: Message, newOutput: Message) => {
        const newMessages = value.map((message) => {
          if (message.id === newInput.id) return newInput;
          if (message.id === newOutput.id) return newOutput;
          return message;
        });
        onChange(newMessages);
      };
      const handleDelete = () => {
        const newMessages = value.filter((message) => message.id !== input.id && message.id !== output.id);
        onChange(newMessages);
      };

      elements.push(
        <Box key={input.id}>
          <NShotSampleInput
            index={i / 2}
            input={input}
            output={output}
            onChange={handleChange}
            onDelete={handleDelete}
          />
        </Box>
      );
    }

    return elements;
  }, [onChange, sampleMessages, value]);

  return (
    <Stack sx={{ flex: 1, overflow: "hidden" }}>
      {/* system prompt */}
      <Textarea label="System prompt" value={systemMessage.text} onChange={handleChangeSystemMessage} />

      {/* samples */}
      <ScrollArea
        sx={(theme) => ({
          flex: 1,
          border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[3]}`,
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
          borderRadius: theme.radius.sm,
        })}
      >
        <Stack spacing="sm">
          {/* sample inputs */}
          {samples}

          {/* add sample */}
          <Stack align="center">
            <Button
              color="gray"
              leftIcon={<IconPlus size="1rem" />}
              size="xs"
              variant="outline"
              onClick={handleAddSample}
            >
              Add sample
            </Button>
          </Stack>
        </Stack>
      </ScrollArea>

      {/* test messages */}
      <Flex gap="sm" sx={{ flex: 1 }}>
        <Textarea
          label="Test input"
          styles={{
            root: { display: "flex", flexDirection: "column", flex: 1 },
            wrapper: { flex: 1 },
            input: { height: "100%" },
          }}
          value={testMessages[0].text}
          onChange={handleTestInputChange}
        />
        <Textarea
          label="Test output"
          styles={{
            root: { display: "flex", flexDirection: "column", flex: 1 },
            wrapper: { flex: 1 },
            input: { height: "100%" },
          }}
          value={testMessages[1].text}
          readOnly
        />
      </Flex>
    </Stack>
  );
};
