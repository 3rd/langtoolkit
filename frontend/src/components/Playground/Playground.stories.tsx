import type { StoryObj, Meta } from "@storybook/react";
import { Playground } from "./Playground";
import type { PlaygroundProps } from "./Playground";

const meta: Meta<typeof Playground> = {
  title: "Playground/Playground",
  component: Playground,
  decorators: [
    (Story) => (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          padding: "1rem",
        }}
      >
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<PlaygroundProps>;

export const Default: Story = {
  args: {
    roles: ["system", "assistant", "user"],
  },
};
