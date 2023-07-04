import type { StoryObj, Meta } from "@storybook/react";
import { Textarea } from "./Textarea";
import type { TextareaProps } from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "Basic/Textarea",
  component: Textarea,
};
export default meta;

type Story = StoryObj<TextareaProps>;

export const Default: Story = {
  args: {},
};
