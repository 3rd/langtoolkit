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

  const messageItems = messages.map((message) => {
    const handleChange = (role: string, text: string) => handleMessageChange(message.id, role, text);
    const handleDelete = () => onDeleteMessage(message.id);

    return (
      <ChatInputMessage
        key={message.id}
        {...message}
        availableRoles={roles}
        onChange={handleChange}
        onDelete={handleDelete}
      />
    );
  });

  return (
    <ScrollArea sx={{ flex: 1 }}>
      <Box>
        {messageItems}

        <Stack align="center">
          <Button color="gray" size="xs" leftIcon={<IconPlus size="1rem" />} variant="outline" onClick={onNewMessage}>
            Add message
          </Button>
        </Stack>
      </Box>
    </ScrollArea>
  );
};
