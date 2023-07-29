import { useState } from "react";
import type { StoryObj, Meta } from "@storybook/react";
import { ChatInputMessage } from "./ChatInputMessage";
import type { ChatInputMessageProps } from "./ChatInputMessage";

const meta: Meta<typeof ChatInputMessage> = {
  title: "Chat/ChatInput/ChatInputMessage",
  component: ChatInputMessage,
};
export default meta;

type Story = StoryObj<ChatInputMessageProps>;

const Wrapper = (args: ChatInputMessageProps) => {
  const [text, setText] = useState(args.text);
  const [role, setRole] = useState(args.role);

  const handleChange = (newRole: string, newText: string) => {
    setText(newText);
    setRole(newRole);
  };
  return <ChatInputMessage {...args} role={role} text={text} onChange={handleChange} />;
};

export const Default: Story = {
  args: {
    role: "system",
    text: "Why is there something rather than nothing?",
    availableRoles: ["system", "assistant", "user"],
  },
  render: (args) => <Wrapper {...args} />,
};
