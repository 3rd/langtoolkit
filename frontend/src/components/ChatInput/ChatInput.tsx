import { Box, Button, ScrollArea, Stack } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { ChatInputMessage } from "./ChatInputMessage";

export interface ChatInputProps {
  roles: string[];
  messages: {
    id: string;
    role: string;
    text: string;
  }[];
  onChangeMessage: (message: ChatInputProps["messages"][number]) => void;
  onDeleteMessage: (messageId: string) => void;
  onNewMessage: () => void;
}

export const ChatInput = ({ messages, roles, onChangeMessage, onDeleteMessage, onNewMessage }: ChatInputProps) => {
  const handleMessageChange = (messageId: string, role: string, text: string) =>
    onChangeMessage({ id: messageId, role, text });

  const messageItems = messages.map((message, index) => {
    const handleChange = (role: string, text: string) => handleMessageChange(message.id, role, text);
    const handleDelete = () => onDeleteMessage(message.id);

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
    <Stack sx={{ flex: 1, overflow: "hidden" }}>
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

      <Stack align="center">
        <Button color="gray" size="xs" leftIcon={<IconPlus size="1rem" />} variant="outline" onClick={onNewMessage}>
          Add message
        </Button>
      </Stack>
    </Stack>
  );
};
