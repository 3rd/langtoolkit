import { useModels } from "@/api/models";
import { useSettings } from "@/api/settings";
import { Model } from "@/types";
import { Badge, Box, Button, Card, Flex, Paper, PasswordInput, Stack, Switch, Table, Tabs, Text } from "@mantine/core";
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

const ModelList = ({ models }: { models: Model[] }) => {
  return (
    <Stack>
      <Text size="md" weight="bold">
        Models
      </Text>
      <Card padding="0" withBorder>
        <Table striped highlightOnHover>
          <thead>
            <tr>
              <th>Name</th>
              <th style={{ textAlign: "right" }}>Enabled</th>
            </tr>
          </thead>
          <tbody>
            {models.map((model) => (
              <tr key={model.id}>
                {/* name */}
                <td>
                  <Text size="sm">{model.model}</Text>
                  {/* not available badge */}
                  {!model.available && <Badge color="gray">Not available</Badge>}
                </td>
                {/* toggle */}
                <td>
                  <Switch
                    styles={{ root: { display: "flex", justifyContent: "flex-end" } }}
                    size="sm"
                    checked={model.enabled}
                    disabled={!model.available}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Stack>
  );
};

export const SettingsPage = () => {
  const [settings, setSettings] = useSettings();
  const models = useModels();

  const form = useForm({
    initialValues: settings,
    validate: zodResolver(schema),
  });

  const openaiModels = models.filter((model) => model.vendor === "openai");
  const anthropicModels = models.filter((model) => model.vendor === "anthropic");

  const handleSubmit = (values: z.infer<typeof schema>) => {
    setSettings(values);
  };

  useEffect(() => {
    form.setValues(settings);
    form.resetDirty(settings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <Stack px="lg" spacing="md">
              Platform
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="models">
            <Stack px="lg" spacing="md">
              {/* OpenAI */}
              <Paper p="md" shadow="xs">
                <Stack spacing="sm">
                  <Flex align="center" justify="space-between">
                    <Text size="lg" weight={600}>
                      OpenAI
                    </Text>
                    {/* toggle */}
                    <Switch
                      checked={form.values.models.openai.enabled}
                      label={form.values.models.openai.enabled ? "Enabled" : "Disabled"}
                      {...form.getInputProps("models.openai.enabled")}
                    />
                  </Flex>
                  {/* api key */}
                  <PasswordInput
                    label="API Key"
                    placeholder="sk-01234567890"
                    {...form.getInputProps("models.openai.apiKey")}
                  />
                  {/* models */}
                  {openaiModels.length > 0 && <ModelList models={openaiModels} />}
                </Stack>
              </Paper>

              {/* Anthropic */}
              <Paper p="md" shadow="xs">
                <Stack spacing="sm">
                  <Flex align="center" justify="space-between">
                    <Text size="lg" weight={600}>
                      Anthropic
                    </Text>
                    {/* toggle */}
                    <Switch
                      checked={form.values.models.anthropic.enabled}
                      label={form.values.models.anthropic.enabled ? "Enabled" : "Disabled"}
                      {...form.getInputProps("models.anthropic.enabled")}
                    />
                  </Flex>
                  {/* api key */}
                  <PasswordInput
                    label="API Key"
                    placeholder="01234567890"
                    type="password"
                    {...form.getInputProps("models.anthropic.apiKey")}
                  />
                  {/* models */}
                  {anthropicModels.length > 0 && <ModelList models={anthropicModels} />}
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
