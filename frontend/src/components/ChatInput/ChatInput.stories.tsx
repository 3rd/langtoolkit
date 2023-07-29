import { useState } from "react";
import type { StoryObj, Meta } from "@storybook/react";
import { nanoid } from "nanoid";
import { ChatInput } from "./ChatInput";
import type { ChatInputProps } from "./ChatInput";

const meta: Meta<typeof ChatInput> = {
  title: "Playground/ChatInput",
  component: ChatInput,
};
export default meta;

type Story = StoryObj<ChatInputProps>;

const state = {
  messages: [
    { id: "1", role: "system", text: "You are an expert in everything." },
    { id: "2", role: "user", text: "Why is there something rather than nothing?" },
  ],
};

const Wrapper = (args: ChatInputProps) => {
  const [messages, setMessages] = useState(args.messages);

  const handleChangeMessage = (message: ChatInputProps["messages"][number]) => {
    const newMessages = messages.map((m) => (m.id === message.id ? message : m));
    setMessages(newMessages);
  };

  const handleDeleteMessage = (messageId: string) => {
    const newMessages = messages.filter((m) => m.id !== messageId);
    setMessages(newMessages);
  };

  const handleNewMessage = () => {
    const newMessage = { id: nanoid(), role: "user", text: "" };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
  };

  return (
    <ChatInput
      {...args}
      messages={messages}
      onChangeMessage={handleChangeMessage}
      onDeleteMessage={handleDeleteMessage}
      onNewMessage={handleNewMessage}
    />
  );
};

export const Default: Story = {
  args: {
    roles: ["system", "assistant", "user"],
    messages: state.messages,
  },
  render: (args) => <Wrapper {...args} />,
};
