import type { StoryObj, Meta } from "@storybook/react";
import { Text } from "./Text";
import type { TextProps } from "./Text";

const meta: Meta<typeof Text> = {
  title: "Basic/Text",
  component: Text,
};
export default meta;

type Story = StoryObj<TextProps>;

export const Default: Story = {
  args: {
    children: "Hello World",
  },
};

export const WithVariant: Story = {
  args: {
    children: "Hello World",
    variant: "h1",
  },
};

export const WithClasses: Story = {
  args: {
    children: "Hello World",
    variant: "h1",
    className: "text-red-500",
  },
};
