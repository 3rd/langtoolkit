import type { StoryObj, Meta } from "@storybook/react";
import { TestComponent } from "./TestComponent";

const meta: Meta<typeof TestComponent> = {
  title: "TestComponent",
  component: TestComponent,
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
};
