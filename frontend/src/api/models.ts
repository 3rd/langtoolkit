/* eslint-disable no-await-in-loop */
import { useEffect, useState } from "react";
import { Model } from "@/types";
import { pb } from "./client";
import { ModelsResponse } from "./types";
import { ClientResponseError } from "pocketbase";
import { getSettings } from "./settings";

type GetModelsOptions = {
  enabled?: boolean;
  available?: boolean;
};

const getModels = async (opts?: GetModelsOptions): Promise<Model[]> => {
  const filter = [];
  if (opts) {
    if (opts.enabled !== undefined) filter.push(`enabled = ${opts.enabled}`);
    if (opts.available !== undefined) filter.push(`available = ${opts.available}`);
  }

  const records = await pb.collection("models").getFullList<ModelsResponse>({
    sort: "-external_created_at",
    filter: filter.join(" && "),
    $autoCancel: false,
  });
  return records.map((record) => ({
    id: record.id,
    vendor: record.vendor,
    model: record.model,
    enabled: record.enabled,
    available: record.available,
  }));
};

const setEnabledModels = async (enabledMap: Record<string, boolean>) => {
  const models = await getModels();
  const promises = models.map((model) => {
    const enabled = enabledMap[model.id] ?? model.enabled;
    return pb.collection("models").update(model.id, { enabled });
  });
  await Promise.all(promises);
};

const useModels = (opts?: GetModelsOptions) => {
  const [state, setState] = useState<Model[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      try {
        const settings = await getSettings();
        if (!settings.models.openai.enabled) return;
        const data = await getModels(opts);
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
  }, [opts]);

  const setEnabled = async (enabledMap: Record<string, boolean>) => {
    await setEnabledModels(enabledMap);
    const data = await getModels(opts);
    setState(data);
  };

  return [state, setEnabled] as const;
};

export { getModels, useModels };
