import { memo } from "react";
import { ActionIcon, Box, CopyButton, Textarea, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";

export interface CompletionInputProps {
  value: string;
  onChange: (value: string) => void;
}

// {/* <Box */}
// {/*   sx={(theme) => ({ */}
// {/*     paddingLeft: theme.spacing.md, */}
// {/*     paddingRight: theme.spacing.md, */}
// {/*     height: "100%", */}
// {/*   })} */}
// {/* > */}
// {/*   <Textarea */}
// {/*     placeholder="Act as if you want to make a difference..." */}
// {/*     size="md" */}
// {/*     styles={{ */}
// {/*       root: { height: "100%" }, */}
// {/*       wrapper: { height: "100%" }, */}
// {/*       input: { height: "100%" }, */}
// {/*     }} */}
// {/*     value={value} */}
// {/*     variant="unstyled" */}
// {/*     withAsterisk */}
// {/*     onChange={(event) => onChange(event.currentTarget.value)} */}
// {/*   /> */}
// {/* </Box> */}

export const CompletionInput = memo(({ value, onChange }: CompletionInputProps) => {
  return (
    <Textarea
      value={value}
      onChange={(event) => onChange(event.currentTarget.value)}
      label="Input"
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
      rightSection={
        <CopyButton value={value} timeout={2000}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? "Copied" : "Copy"} withArrow position="right">
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
    />
  );
});
