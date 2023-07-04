import type { StoryObj, Meta } from "@storybook/react";
import { Separator } from "./Separator";

const meta: Meta<typeof Separator> = {
  title: "Basic/Separator",
  component: Separator,
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
};
