import { useEffect, useState } from "react";
import { CompletionsResponse } from "./types";
import { pb } from "./client";
import { ListResult } from "pocketbase";

type UseCompletionsOptions = {
  page?: number;
  perPage?: number;
  sort?: string;
  filter?: string;
  fields?: string[];
};
const useCompletions = ({ page, perPage, sort, filter, fields }: UseCompletionsOptions) => {
  const [data, setData] = useState<ListResult<CompletionsResponse> | null>(null);

  useEffect(() => {
    const fetchCompletions = async () => {
      const records = await pb.collection("completions").getList<CompletionsResponse>(page, perPage, {
        sort: sort ?? "-created",
        ...(filter ? { filter } : {}),
        ...(fields ? { fields: fields.join(",") } : {}),
      });
      setData(records);
    };

    fetchCompletions();
  }, [page, perPage, sort, filter]);

  return data;
};

export { useCompletions };
