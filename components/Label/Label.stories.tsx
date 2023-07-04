import type { StoryObj, Meta } from "@storybook/react";
import { Label } from "./Label";

const meta: Meta<typeof Label> = {
  title: "Basic/Label",
  component: Label,
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {
    children: "Label",
  },
};
