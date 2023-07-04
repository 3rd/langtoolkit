import { useCallback, useMemo } from "react";
import { Label } from "@/components/Label";
import { Stack } from "@/components/Stack";
import { Textarea } from "@/components/Textarea";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import type { TaskInput, TaskInputValue, TaskModel } from "@/types";
import { models } from "@/config/models";

const modeGroups = [
  {
    id: "basic",
    label: "Basic",
    modes: [
      { id: "complete", label: "Complete" },
      { id: "chat", label: "Chat" },
      { id: "insert", label: "Insert" },
      { id: "edit", label: "Edit" },
    ],
  },
  {
    id: "advanced",
    label: "Advanced",
    modes: [
      { id: "workflow", label: "Workflow" },
      { id: "agent", label: "Agent" },
    ],
  },
];

export type PlaygroundProps = {
  prompt?: string;
  inputs?: TaskInput[];
  onPromptChange?: (prompt: string) => void;
  onInputChange?: (key: string, value: TaskInputValue) => void;
};

export const Playground = ({ prompt, inputs, onPromptChange, onInputChange }: PlaygroundProps) => {
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onPromptChange?.(e.target.value);
  };

  const handleInputChange = useCallback(
    (input: TaskInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value: TaskInputValue = e.target.value;
      onInputChange?.(input.key, value);
    },
    [onInputChange]
  );

  const inputFields = useMemo(() => {
    return inputs?.map((input) => {
      const handleChange = handleInputChange(input);
      const id = `input-${input.key}`;

      return (
        <Stack direction="column" key={input.key}>
          <Label htmlFor={id}>
            <Text className="font-medium" noWrap>
              {input.label}
            </Text>
          </Label>
          {/* input */}
          {input.type === "text" && !input.multiline && (
            <Input id={id} onChange={handleChange} placeholder="" value={input.value} />
          )}
          {/* textarea */}
          {input.type === "text" && input.multiline && (
            <Textarea id={id} onChange={handleChange} placeholder="">
              {input.value}
            </Textarea>
          )}
        </Stack>
      );
    });
  }, [handleInputChange, inputs]);

  const modeSelectEntries = useMemo(() => {
    const items = modeGroups.map((group) => {
      return (
        <SelectGroup key={group.id}>
          <SelectLabel>{group.label}</SelectLabel>
          {group.modes.map((mode) => {
            return (
              <SelectItem key={mode.id} value={mode.id}>
                {mode.label}
              </SelectItem>
            );
          })}
        </SelectGroup>
      );
    });

    return {
      default: modeGroups[0].modes[0].id,
      items,
    };
  }, []);

  const modelSelectEntries = useMemo(() => {
    const groups = models.reduce<Record<string, TaskModel[]>>((acc, model) => {
      if (!acc[model.group]) {
        acc[model.group] = [];
      }
      acc[model.group].push(model);
      return acc;
    }, {});

    const items = Object.entries(groups).map(([group, models]) => {
      return (
        <SelectGroup key={group}>
          <SelectLabel>{group}</SelectLabel>
          {models.map((model) => {
            return (
              <SelectItem key={model.id} value={model.id}>
                {model.label}
              </SelectItem>
            );
          })}
        </SelectGroup>
      );
    });

    return {
      default: models.length > 0 ? models[0].id : undefined,
      items,
    };
  }, []);

  return (
    <Stack className="flex-1" gap={4}>
      {/* left */}
      <Stack className="flex-1" direction="column" gap={4}>
        {/* prompt */}
        <Stack className="flex-1" direction="column">
          <Label htmlFor="prompt">
            <Text>Prompt</Text>
          </Label>
          <Textarea className="flex-1" id="prompt" onChange={handlePromptChange} placeholder="Prompt" value={prompt} />
        </Stack>
        {/* inputs */}
        {Array.isArray(inputs) && inputs.length > 0 && (
          <Stack direction="column">
            <Label>
              <Text>Inputs</Text>
            </Label>
            <Card className="p-2 px-3">
              <Stack direction="column" gap={1}>
                {inputFields}
              </Stack>
            </Card>
          </Stack>
        )}
        {/* actions */}
        <Stack align="start" direction="column">
          <Button>Submit</Button>
        </Stack>
      </Stack>
      {/* right */}
      <Stack className="min-w-[200px]" direction="column" gap={2}>
        {/* mode */}
        <Stack direction="column">
          <Label>
            <Text>Mode</Text>
          </Label>
          <Select value={modeSelectEntries.default}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>{modeSelectEntries.items}</SelectContent>
          </Select>
        </Stack>
        {/* model */}
        <Stack direction="column">
          <Label>
            <Text>Model</Text>
          </Label>
          <Select value={modelSelectEntries.default}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>{modelSelectEntries.items}</SelectContent>
          </Select>
        </Stack>
      </Stack>
    </Stack>
  );
};