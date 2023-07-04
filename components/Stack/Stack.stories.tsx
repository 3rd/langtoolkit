import type { StoryObj, Meta } from "@storybook/react";
import { Stack } from "./Stack";
import type { StackProps } from "./Stack";

const meta: Meta<typeof Stack> = {
  title: "Basic/Stack",
  component: Stack,
};
export default meta;

type Story = StoryObj<StackProps>;

const children = [
  <div key={1} className="w-20 h-20 bg-red-500" />,
  <div key={2} className="w-20 h-20 bg-blue-500" />,
  <div key={3} className="w-20 h-20 bg-green-500" />,
  <div key={4} className="w-20 h-20 bg-yellow-500" />,
];

export const Default: Story = {
  args: {
    children,
    gap: 3,
  },
};
