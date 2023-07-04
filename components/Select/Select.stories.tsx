import type { StoryObj, Meta } from "@storybook/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";

const meta: Meta<typeof Select> = {
  title: "Basic/Select",
  component: Select,
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {
    children: (
      <>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </>
    ),
  },
};
