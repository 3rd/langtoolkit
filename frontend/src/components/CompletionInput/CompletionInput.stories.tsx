import type { StoryObj, Meta } from "@storybook/react";
import { CompletionInput } from "./CompletionInput";
import type { CompletionInputProps } from "./CompletionInput";

const meta: Meta<typeof CompletionInput> = {
  title: "Playground/CompletionInput",
  component: CompletionInput,
};
export default meta;

type Story = StoryObj<CompletionInputProps>;

export const Default: Story = {
  args: {},
};
