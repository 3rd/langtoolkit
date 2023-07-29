import { useMemo, useState } from "react";
import { Text } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import { useCompletions } from "@/api/completions";
import { CompletionsResponse } from "@/api/types";

const render = {
  input: (record: CompletionsResponse) => {
    const messages = record.input as { role: string; text: string }[];
    const contextMessagesCount = messages.length - 1;
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return "";
    return (
      <>
        {contextMessagesCount > 0 && (
          <Text size="sm" color="gray" style={{ marginBottom: 5 }}>
            ... {contextMessagesCount} other messages
          </Text>
        )}
        <Text>{lastMessage.text}</Text>
      </>
    );
  },
};

const PER_PAGE = 30;

export const LogsPage = () => {
  const [page, setPage] = useState(1);
  const data = useCompletions({
    page,
    perPage: PER_PAGE,
    fields: ["id", "user", "source", "input", "output", "vendor", "model", "created"],
  });

  const records = useMemo(() => {
    if (!data) return [];
    return data.items.map((record) => {
      const model = `${record.vendor}/${record.model}`;

      return { key: record.id, ...record, model };
    });
  }, [data]);

  return (
    <DataTable
      withBorder
      borderRadius="sm"
      withColumnBorders
      striped
      highlightOnHover
      columns={[
        { accessor: "id", width: "1%" },
        { accessor: "user", width: "1%" },
        { accessor: "source", width: "1%" },
        { accessor: "model", width: "1%" },
        { accessor: "input", width: 100, render: render.input, ellipsis: true },
        { accessor: "output", width: 200, ellipsis: true },
      ]}
      records={records}
      page={page}
      recordsPerPage={PER_PAGE}
      totalRecords={data?.totalItems || 0}
      onPageChange={setPage}
    />
  );
};
