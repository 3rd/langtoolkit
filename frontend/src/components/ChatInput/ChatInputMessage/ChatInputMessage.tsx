import { capitalize } from "@/utils/string";
import { ActionIcon, Avatar, Flex, Group, Select, Textarea, useMantineTheme } from "@mantine/core";
import { IconAdjustmentsCog, IconChevronDown, IconTrash, IconUser } from "@tabler/icons-react";
import { useMemo } from "react";

export interface ChatInputMessageProps {
  role: string;
  text: string;
  availableRoles: string[];
  onChange?: (role: string, text: string) => void;
  onDelete?: () => void;
}

export const ChatInputMessage = ({ role, text, availableRoles, onChange, onDelete }: ChatInputMessageProps) => {
  const theme = useMantineTheme();

  const selectOptions = availableRoles.map((currentRole) => {
    return { value: currentRole, label: capitalize(currentRole) };
  });

  const handleRoleChange = (newRole: string) => onChange?.(newRole, text);
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => onChange?.(role, event.target.value);

  const isUserMessage = role === "user";

  const backgroundColor = useMemo(() => {
    if (isUserMessage) {
      return theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[2];
    }
    return theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0];
  }, [isUserMessage, theme]);

  const placeholder = useMemo(() => {
    return `${capitalize(role)} message`;
  }, [role]);

  const avatarContent = useMemo(() => {
    if (role === "system") return <IconAdjustmentsCog size="1.2rem" />;
    if (role === "user") return <IconUser size="1.2rem" />;
    if (role === "assistant") return "AI";
  }, [role]);

  return (
    <Flex
      align="flex-start"
      justify="space-between"
      sx={{
        backgroundColor,
        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
        borderBottom: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[3]}`,
        paddingRight: theme.spacing.lg,
      }}
    >
      <Avatar color={isUserMessage ? "blue" : "violet"} mt={4} radius="xl">
        {avatarContent}
      </Avatar>
      {/* textarea */}
      <Textarea
        minRows={2}
        placeholder={placeholder}
        styles={{
          root: {
            width: "100%",
          },
          input: {
            overflow: "hidden",
            border: "none",
            backgroundColor: "transparent",
            height: "auto",
          },
        }}
        value={text}
        variant="default"
        autosize
        onChange={handleTextChange}
      />

      {/* actions and role switcher */}
      <Flex align="center" gap="xs">
        {/* role */}
        <Select
          data={selectOptions}
          dropdownPosition="bottom"
          fs="xs"
          rightSection={<IconChevronDown size="1rem" />}
          rightSectionWidth={30}
          styles={{
            wrapper: {
              maxWidth: "130px",
            },
            input: {
              padding: `4px ${theme.spacing.xs}`,
              // backgroundColor: theme.colors.gray[0],
              borderRadius: theme.radius.sm,
              minHeight: "initial",
              height: "auto",
              lineHeight: "initial",
              fontSize: theme.fontSizes.xs,
            },
            rightSection: { pointerEvents: "none" },
            itemsWrapper: {
              padding: 0,
            },
            item: {
              fontSize: theme.fontSizes.xs,
              padding: `4px ${theme.spacing.xs}`,
              borderRadius: 0,
            },
          }}
          value={role}
          variant="default"
          withinPortal
          onChange={handleRoleChange}
        />

        {/* action buttons */}
        <Group position="apart" spacing="xs">
          {/* delete button */}
          <ActionIcon
            aria-label="Delete message"
            disabled={!onDelete}
            size="xs"
            sx={{
              "&:hover": {
                opacity: 0.7,
              },
            }}
            variant="transparent"
            onClick={onDelete}
          >
            <IconTrash size="1rem" />
          </ActionIcon>
        </Group>
      </Flex>
    </Flex>
  );
};
