import { Message, Mode } from "./types";

export type PlaygroundStandardStorage = {
  model: string;
  messages: Message[];
  max_tokens: number;
  temperature?: number;
  top_p: number;
  stream: boolean;
  stop: string[];
  frequency_penalty: number;
  presence_penalty: number;
};

const createBucket = <T>(key: string) => {
  return {
    get: (): Partial<T> | null => {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          return JSON.parse(item);
        } catch {}
      }
      return null;
    },
    set: (value: Partial<T>) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
  };
};

export const local = {
  playground: {
    mode: createBucket<Mode>("playground-mode"),
    complete: createBucket<PlaygroundStandardStorage>("playground-complete"),
    chat: createBucket<PlaygroundStandardStorage>("playground-chat"),
    nshot: createBucket<PlaygroundStandardStorage>("playground-nshot"),
  },
};
