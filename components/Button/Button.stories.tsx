import type { StoryObj, Meta } from "@storybook/react";
import { Mail } from "lucide-react";
import { Button } from "./Button";
import type { ButtonProps } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Basic/Button",
  component: Button,
};
export default meta;

type Story = StoryObj<ButtonProps>;

export const Default: Story = {
  args: {
    children: "Button",
    variant: "default",
  },
};

export const Icon: Story = {
  args: {
    children: <Mail className="w-4 h-4" />,
    variant: "outline",
    size: "icon",
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Mail className="mr-2 w-4 h-4" /> Login with email
      </>
    ),
  },
};
