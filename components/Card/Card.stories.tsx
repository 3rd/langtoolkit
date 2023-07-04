import type { StoryObj, Meta } from "@storybook/react";
import { Button } from "@/components/Button";
import { Card } from "./Card";
import type { CardProps } from "./Card";

const meta: Meta<typeof Card> = {
  title: "Basic/Card",
  component: Card,
};
export default meta;

type Story = StoryObj<CardProps>;

export const Default: Story = {
  args: {
    children: (
      <>
        <Card.Header>
          <Card.Title>Card Title</Card.Title>
          <Card.Description>Card Description</Card.Description>
        </Card.Header>
        <Card.Content>
          <p>Card Content</p>
        </Card.Content>
        <Card.Footer className="flex justify-between">
          <Button>Deploy</Button>
          <Button variant="destructive">Cancel</Button>
        </Card.Footer>
      </>
    ),
  },
};
