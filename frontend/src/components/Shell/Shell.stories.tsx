import type { StoryObj, Meta } from "@storybook/react";
import { Shell } from "./Shell";
import type { ShellProps } from "./Shell";
import { Playground } from "../Playground";

const meta: Meta<typeof Shell> = {
  title: "App/Shell",
  component: Shell,
};
export default meta;

type Story = StoryObj<ShellProps>;

export const Default: Story = {
  args: {
    children: <Playground roles={["system", "user"]} />,
  },
};
