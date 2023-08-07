import { Message } from "@/types";
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
  value: Message[];
  onChange: (messages: Message[]) => void;
}

export const NShotInput = ({ value, onChange }: NShotInputProps) => {
  const handleChangeMessage = (messageId: string, role: string, text: string) => {
    const newMessages = value.map((message) => {
      if (message.id === messageId) return { ...message, role, text };
      return message;
    });
    onChange(newMessages);
  };

  const handleDeleteMessage = (messageId: string) => {
    const newMessages = value.filter((message) => message.id !== messageId);
    onChange(newMessages);
  };

  const handleAddMessage = () => {
    const newMessages = [...value, { id: Math.random().toString(), role: "", text: "" }];
    onChange(newMessages);
  };

  const samples = value.map((message) => {
    const handleChange = (role: string, text: string) => handleChangeMessage(message.id, role, text);
    const handleDelete = () => handleDeleteMessage(message.id);
    return <div key={message.id}>x</div>;
  });

  return (
    <Stack sx={{ flex: 1, overflow: "hidden" }}>
      {/* <Textarea label="System prompt" value={value} onChange={(event) => onChange(event.currentTarget.value)} /> */}

      <ScrollArea
        sx={(theme) => ({
          flex: 1,
          border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[3]}`,
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
          borderRadius: theme.radius.sm,
        })}
      >
        {samples}
      </ScrollArea>

      <Stack align="center">
        <Button color="gray" leftIcon={<IconPlus size="1rem" />} size="xs" variant="outline" onClick={handleAddMessage}>
          Add item
        </Button>
      </Stack>
    </Stack>
  );
};
