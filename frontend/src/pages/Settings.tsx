import { useSettings } from "@/api/settings";
import { Button, Flex, Paper, PasswordInput, Stack, Switch, Tabs, Text } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { IconPhoto } from "@tabler/icons-react";
import { useEffect } from "react";
import { z } from "zod";

const schema = z.object({
  models: z.object({
    openai: z.object({
      enabled: z.boolean(),
      apiKey: z.string(),
    }),
    anthropic: z.object({
      enabled: z.boolean(),
      apiKey: z.string(),
    }),
    custom: z.array(
      z.object({
        id: z.string(),
        url: z.string(),
        payload: z.string(),
        headers: z.record(z.string()),
      })
    ),
  }),
});

export const SettingsPage = () => {
  const [settings, setSettings] = useSettings();

  const form = useForm({
    initialValues: settings,
    validate: zodResolver(schema),
  });

  const handleSubmit = (values: z.infer<typeof schema>) => {
    setSettings(values);
  };

  useEffect(() => {
    form.setValues(settings);
    form.resetDirty(settings);
  }, [settings]);

  return (
    <Stack>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Tabs defaultValue="models" orientation="vertical">
          <Tabs.List>
            <Tabs.Tab icon={<IconPhoto size="0.8rem" />} value="platform">
              Platform
            </Tabs.Tab>
            <Tabs.Tab icon={<IconPhoto size="0.8rem" />} value="models">
              Models
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="platform">
            <Stack spacing="md" px="lg">
              Platform
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="models">
            <Stack spacing="md" px="lg">
              {/* OpenAI */}
              <Paper shadow="xs" p="md">
                <Stack spacing="sm">
                  <Text weight={600} size="lg">
                    OpenAI
                  </Text>
                  <Switch
                    label={form.values.models.openai.enabled ? "Enabled" : "Disabled"}
                    checked={form.values.models.openai.enabled}
                    {...form.getInputProps("models.openai.enabled")}
                  />
                  <PasswordInput
                    label="API Key"
                    placeholder="sk-01234567890"
                    {...form.getInputProps("models.openai.apiKey")}
                  />
                </Stack>
              </Paper>

              {/* Anthropic */}
              <Paper shadow="xs" p="md">
                <Stack spacing="sm">
                  <Text weight={600} size="lg">
                    Anthropic
                  </Text>
                  <Switch
                    label={form.values.models.anthropic.enabled ? "Enabled" : "Disabled"}
                    checked={form.values.models.anthropic.enabled}
                    {...form.getInputProps("models.anthropic.enabled")}
                  />
                  <PasswordInput
                    label="API Key"
                    placeholder="01234567890"
                    type="password"
                    {...form.getInputProps("models.anthropic.apiKey")}
                  />
                </Stack>
              </Paper>

              {/* submit */}
              <Flex>
                <Button disabled={!form.isDirty()} type="submit">
                  Save
                </Button>
              </Flex>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </form>
    </Stack>
  );
};
