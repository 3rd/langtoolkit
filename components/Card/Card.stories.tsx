import type { StoryObj, Meta } from "@storybook/react";
import { Card } from "./Card";
import type { CardProps } from "./Card";
import { Button } from "../Button";

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
          <Button variant="outline">Cancel</Button>
          <Button>Deploy</Button>
        </Card.Footer>
      </>
    ),
  },
};
