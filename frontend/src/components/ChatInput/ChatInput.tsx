import { Button, ScrollArea, Stack } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { ChatInputMessage } from "./ChatInputMessage";
import { Message } from "@/types";

export interface ChatInputProps {
  roles: string[];
  value: Message[];
  onChange: (messages: Message[]) => void;
}

export const ChatInput = ({ roles, value, onChange }: ChatInputProps) => {
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

  const messageItems = value.map((message, index) => {
    const handleChange = (role: string, text: string) => handleChangeMessage(message.id, role, text);
    const handleDelete = () => handleDeleteMessage(message.id);

    return (
      <ChatInputMessage
        key={message.id}
        {...message}
        availableRoles={roles}
        onChange={handleChange}
        onDelete={index > 0 ? handleDelete : undefined}
      />
    );
  });

  return (
    <>
      <Stack
        sx={(theme) => ({
          flex: 1,
          overflow: "hidden",
          boxShadow: theme.shadows.md,
        })}
      >
        <ScrollArea
          sx={(theme) => ({
            flex: 1,
            border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[3]}`,
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
            borderRadius: theme.radius.sm,
          })}
        >
          {messageItems}
        </ScrollArea>
      </Stack>

      <Stack align="center">
        <Button color="gray" leftIcon={<IconPlus size="1rem" />} size="xs" variant="outline" onClick={handleAddMessage}>
          Add message
        </Button>
      </Stack>
    </>
  );
};
