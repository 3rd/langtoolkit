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
