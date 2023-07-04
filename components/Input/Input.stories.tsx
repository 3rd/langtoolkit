import type { StoryObj, Meta } from "@storybook/react";
import { Input } from "./Input";
import type { InputProps } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Basic/Input",
  component: Input,
};
export default meta;

type Story = StoryObj<InputProps>;

export const Default: Story = {
  args: {},
};
