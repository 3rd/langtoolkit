export type User = {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar: string | null;
  role: "admin" | "user";
};

export type Settings = {
  models: {
    openai: {
      enabled: boolean;
      apiKey: string;
    };
    anthropic: {
      enabled: boolean;
      apiKey: string;
    };
    custom: {
      id: string;
      url: string;
      payload: string;
      headers: Record<string, string>;
    }[];
  };
};

export type Model = {
  id: string;
  vendor: string;
  model: string;
  enabled: boolean;
  available: boolean;
};

export type Mode = "chat" | "complete" | "nshot";

export type Message = {
  id: string;
  role: string;
  text: string;
};
