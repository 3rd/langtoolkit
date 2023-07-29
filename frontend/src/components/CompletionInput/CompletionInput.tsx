import { memo } from "react";
import { Box, Textarea } from "@mantine/core";

export interface CompletionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const CompletionInput = memo(({ value, onChange }: CompletionInputProps) => {
  return (
    <Box
      sx={(theme) => ({
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        height: "100%",
      })}
    >
      <Textarea
        placeholder="Act as if you want to make a difference..."
        size="md"
        styles={{
          root: { height: "100%" },
          wrapper: { height: "100%" },
          input: { height: "100%" },
        }}
        value={value}
        variant="unstyled"
        withAsterisk
        onChange={(event) => onChange(event.currentTarget.value)}
      />
    </Box>
  );
});
