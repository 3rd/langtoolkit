/* eslint-disable no-await-in-loop */
import { useEffect, useState } from "react";
import { Model } from "@/types";
import { pb } from "./client";
import { ModelsResponse } from "./types";
import { ClientResponseError } from "pocketbase";

const getModels = async (): Promise<Model[]> => {
  const records = await pb.collection("models").getFullList<ModelsResponse>({
    sort: "-external_created_at",
  });
  return records.map((record) => ({
    id: record.id,
    vendor: record.vendor,
    model: record.model,
    enabled: record.enabled,
    available: record.available,
  }));
};

const useModels = () => {
  const [state, setState] = useState<Model[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      try {
        const data = await getModels();
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

  return state;
};

export { getModels, useModels };
