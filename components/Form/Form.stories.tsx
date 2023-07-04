import type { StoryObj, Meta } from "@storybook/react";
import { Form } from "./Form";

const meta: Meta<typeof Form> = {
  title: "Basic/Form",
  component: Form,
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {},
};
