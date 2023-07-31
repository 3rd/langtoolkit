import { Message, Mode } from "./types";

export type PlaygroundStandardStorage = {
  model: string;
  stream: boolean;
  temperature?: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  stop: string[];
  maxTokens: number;
  messages: Message[];
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
