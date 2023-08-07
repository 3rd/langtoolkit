import { memo } from "react";
import { ActionIcon, CopyButton, Textarea, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { Message } from "@/types";

export interface CompletionInputProps {
  value: Message[];
  onChange: (messages: Message[]) => void;
}

export const CompletionInput = memo(({ value, onChange }: CompletionInputProps) => {
  if (value.length === 0 || value.length > 2) throw new Error(`CompletionInput received ${value.length} messages`);

  const message = value[0];

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange([{ ...message, text: event.currentTarget.value }, ...value.slice(1)]);
  };

  return (
    <Textarea
      label="Input"
      rightSection={
        <CopyButton timeout={2000} value={message.text}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? "Copied" : "Copy"} position="right" withArrow>
              <ActionIcon color={copied ? "teal" : "gray"} onClick={copy}>
                {copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      }
      rightSectionProps={{
        style: {
          bottom: "auto",
          top: "0",
          transform: "translateY(calc(-100% - 2px))",
          zIndex: 1,
        },
      }}
      styles={{
        root: {
          display: "flex",
          flexDirection: "column",
          flex: 1,
        },
        wrapper: {
          display: "flex",
          flexDirection: "column",
          flex: 1,
        },
        input: {
          flex: 1,
        },
      }}
      value={message.text}
      onChange={handleChange}
    />
  );
});
