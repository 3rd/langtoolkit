import type { StoryObj, Meta } from "@storybook/react";
import { Playground } from "./Playground";
import type { PlaygroundProps } from "./Playground";

const meta: Meta<typeof Playground> = {
  title: "Playground",
  component: Playground,
  decorators: [
    (Story) => (
      <div className="flex absolute top-0 left-0 p-4 w-full h-full">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<PlaygroundProps>;

export const Default: Story = {
  args: {},
};

export const WithInputs: Story = {
  args: {
    prompt: [
      "Your task is to write an email to relay information in a professional manner.",
      "Recipient: {{recipient}}",
      "Context: {{context}}",
      "Information: {{message}}",
      "\nResult:",
    ].join("\n"),
    inputs: [
      { key: "recipient", label: "Recipient", type: "text", value: "John" },
      {
        key: "context",
        label: "Context",
        type: "text",
        multiline: true,
        value: ["- received invitation for conference next Monday", "- only 2 days to prepare"].join("\n"),
      },
      {
        key: "message",
        label: "Message",
        type: "text",
        multiline: true,
        value: [
          "- need quarter report",
          "- ask if they can take some of the work",
          "- ask for ideas on what to include",
        ].join("\n"),
      },
    ],
  },
};
