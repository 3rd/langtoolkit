import { TaskModel } from "@/types";

export const models: TaskModel[] = [
  {
    id: "text-davinci-003",
    label: "text-davinci-003",
    group: "OpenAI",
    capabilities: ["chat", "complete", "edit", "insert"],
  },
  {
    id: "text-curie-001",
    label: "text-curie-001",
    group: "OpenAI",
    capabilities: ["chat", "complete", "edit", "insert"],
  },
  {
    id: "text-babbage-001",
    label: "text-babbage-001",
    group: "OpenAI",
    capabilities: ["chat", "complete", "edit", "insert"],
  },
  {
    id: "text-ada-001",
    label: "text-ada-001",
    group: "OpenAI",
    capabilities: ["chat", "complete", "edit", "insert"],
  },
  {
    id: "claude",
    label: "Claude",
    group: "Anthropic",
    capabilities: ["chat", "complete", "edit", "insert"],
  },
];
