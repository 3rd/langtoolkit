/* eslint-disable no-await-in-loop */
import { useEffect, useState } from "react";
import set from "lodash/set";
import get from "lodash/get";
import { Settings } from "@/types";
import { pb } from "./client";
import { SettingsResponse } from "./types";
import { ClientResponseError } from "pocketbase";

const getDefaultSettings = (): Settings => ({
  models: {
    openai: {
      enabled: false,
      apiKey: "",
    },
    anthropic: {
      enabled: false,
      apiKey: "",
    },
    custom: [],
  },
});

const fieldMap: Record<string, string> = {
  openai_enabled: "models.openai.enabled",
  openai_api_key: "models.openai.apiKey",
  anthropic_enabled: "models.anthropic.enabled",
  anthropic_api_key: "models.anthropic.apiKey",
};

const getSettings = async (): Promise<Settings> => {
  const settings = getDefaultSettings();

  const records = await pb.collection("settings").getFullList<SettingsResponse>({
    $autoCancel: false,
  });
  for (const record of records) {
    const path = fieldMap[record.key];
    if (get(settings, path) === undefined) throw new Error(`Invalid settings key: ${record.key}`);
    set(settings, path, record.value);
  }

  return settings;
};

const updateSettings = async (settings: Partial<Settings>): Promise<Settings | null> => {
  let lastRecord: Settings | null = null;

  const items = Object.entries(fieldMap).reduce<Record<string, unknown>>((acc, [key, path]) => {
    const value = get(settings, path);
    if (value !== undefined) acc[key] = value;
    return acc;
  }, {});

  for (const [key, value] of Object.entries(items)) {
    const record = await pb.collection("settings").getFirstListItem<SettingsResponse>(`key = "${key}"`);
    if (!record) throw new Error(`Invalid settings key: ${key}`);
    lastRecord = await pb.collection("settings").update(record.id, { value });
  }

  return lastRecord;
};

const useSettings = () => {
  const [state, setState] = useState<Settings>(getDefaultSettings());

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      try {
        const data = await getSettings();
        if (signal.aborted) return;
        setState(data);
      } catch (error: unknown) {
        if (error instanceof ClientResponseError && error.isAbort) return;
        throw error;
      }
    })();

    return () => {
      controller.abort();
    };
  }, []);

  const update = async (settings: Partial<Settings>) => {
    const updated = await updateSettings(settings);
    if (updated) setState(updated);
  };

  return [state, update] as const;
};

export { getSettings, updateSettings, useSettings };
