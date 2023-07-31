import { Box, Button, ScrollArea, Stack, Textarea } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

type NShotSystemPromptInput = {
  value: string;
  onChange: (value: string) => void;
};
const NShotSystemPromptInput = ({ value, onChange }: NShotSystemPromptInput) => {
  return <Textarea label="System prompt" value={value} onChange={(event) => onChange(event.currentTarget.value)} />;
};

type NShotExampleInput = {
  value: string;
  index: number;
  onChange: (value: string) => void;
};
const NShotExampleInput = ({ index, value, onChange }: NShotExampleInput) => {
  return (
    <Textarea label={`Example #${index + 1}`} value={value} onChange={(event) => onChange(event.currentTarget.value)} />
  );
};

export interface NShotInputProps {
  messages: {
    id: string;
    role: string;
    text: string;
  }[];
  onChangeMessage: (message: NShotInputProps["messages"][number]) => void;
  onDeleteMessage: (messageId: string) => void;
  onNewMessage: () => void;
}

export const NShotInput = ({ messages, onChangeMessage, onDeleteMessage, onNewMessage }: NShotInputProps) => {
  const handleMessageChange = (messageId: string, role: string, text: string) =>
    onChangeMessage({ id: messageId, role, text });

  const exampleItems = messages.map((message) => {
    const handleChange = (role: string, text: string) => handleMessageChange(message.id, role, text);
    const handleDelete = () => onDeleteMessage(message.id);

    return <div key={message.id}>x</div>;
  });

  return (
    <Stack sx={{ flex: 1, overflow: "hidden" }}>
      <ScrollArea
        sx={(theme) => ({
          flex: 1,
          border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[3]}`,
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
          borderRadius: theme.radius.sm,
        })}
      >
        {exampleItems}
      </ScrollArea>

      <Stack align="center">
        <Button color="gray" leftIcon={<IconPlus size="1rem" />} size="xs" variant="outline" onClick={onNewMessage}>
          Add item
        </Button>
      </Stack>
    </Stack>
  );
};
