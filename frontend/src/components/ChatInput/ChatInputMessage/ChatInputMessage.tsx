import { capitalize } from "@/utils/string";
import { ActionIcon, Box, Flex, Select, Stack, Textarea } from "@mantine/core";
import { IconChevronDown, IconTrash } from "@tabler/icons-react";

export interface ChatInputMessageProps {
  role: string;
  text: string;
  availableRoles: string[];
  onChange?: (role: string, text: string) => void;
  onDelete?: () => void;
}

export const ChatInputMessage = ({ role, text, availableRoles, onChange, onDelete }: ChatInputMessageProps) => {
  const selectOptions = availableRoles.map((currentRole) => ({ value: currentRole, label: capitalize(currentRole) }));

  const handleRoleChange = (newRole: string) => onChange?.(newRole, text);
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => onChange?.(role, event.target.value);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: role === "user" ? "row-reverse" : "row",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: role === "user" ? "flex-end" : "flex-start",
          width: "80%",
        }}
      >
        {/* bubble */}
        <Stack
          align={role === "user" ? "flex-end" : "flex-start"}
          sx={(theme) => ({
            // backgroundColor:
            //   role === "user"
            //     ? theme.colorScheme === "dark"
            //       ? theme.colors.blue[9]
            //       : theme.colors.blue[0]
            //     : theme.colorScheme === "dark"
            //     ? theme.colors.dark[6]
            //     : theme.colors.gray[2],
            // border: `1px solid ${
            //   role === "user"
            //     ? theme.colorScheme === "dark"
            //       ? theme.colors.blue[9]
            //       : theme.colors.blue[2]
            //     : theme.colorScheme === "dark"
            //     ? theme.colors.dark[6]
            //     : theme.colors.gray[3]
            // }`,
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            textAlign: "left",
            gap: "4px",
            width: "100%",
          })}
        >
          {/* role and delete button */}
          <Flex
            align="center"
            gap="0.5rem"
            sx={{
              flexDirection: role === "user" ? "row" : "row-reverse",
            }}
          >
            {/* role */}
            <Select
              data={selectOptions}
              dropdownPosition="bottom"
              rightSection={<IconChevronDown size="1rem" />}
              rightSectionWidth={30}
              styles={(theme) => ({
                wrapper: {
                  maxWidth: "100px",
                },
                input: {
                  padding: `4px ${theme.spacing.xs}`,
                  // backgroundColor: theme.colors.gray[0],
                  borderRadius: theme.radius.sm,
                  minHeight: "initial",
                  height: "auto",
                  lineHeight: "initial",
                },
                rightSection: { pointerEvents: "none" },
              })}
              value={role}
              variant="default"
              withinPortal
              onChange={handleRoleChange}
            />

            {/* delete button */}
            <ActionIcon aria-label="Delete message" variant="light" onClick={onDelete}>
              <IconTrash size="1rem" />
            </ActionIcon>
          </Flex>

          {/* text */}
          {/* TODO: rework layout to group [role,text][actions] */}
          <Textarea
            minRows={2}
            placeholder="Message"
            styles={{
              root: {
                width: "100%",
                ...(role === "user" ? { paddingRight: "36px" } : { paddingLeft: "36px" }),
              },
              input: { overflow: "hidden" },
            }}
            value={text}
            variant="default"
            autosize
            onChange={handleTextChange}
          />
        </Stack>
      </Box>
    </Box>
  );
};
