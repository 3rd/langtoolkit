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
  <div className="w-20 h-20 bg-red-500" key={1} />,
  <div className="w-20 h-20 bg-blue-500" key={2} />,
  <div className="w-20 h-20 bg-green-500" key={3} />,
  <div className="w-20 h-20 bg-yellow-500" key={4} />,
];

export const Default: Story = {
  args: {
    children,
    gap: 3,
  },
};
