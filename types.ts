export type TaskInput = {
  key: string;
  label: string;
  required?: boolean;
} & { type: "text"; multiline?: boolean; value: string; defaultValue?: string };

export type TaskInputValue = TaskInput["value"];

export type TaskModelCapability = "chat" | "complete" | "edit" | "insert";

export type TaskModel = {
  id: string;
  label: string;
  group: string;
  capabilities: TaskModelCapability[];
};
