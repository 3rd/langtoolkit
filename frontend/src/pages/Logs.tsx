import { useMemo, useState } from "react";
import { Stack, Text } from "@mantine/core";
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
          <Text color="gray" size="sm" style={{ marginBottom: 5 }}>
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
    <Stack h="100%">
      <Text size="xl" style={{ marginBottom: 10 }} weight={700}>
        Logs
      </Text>
      <DataTable
        borderRadius="sm"
        columns={[
          { accessor: "id", width: "1%" },
          { accessor: "user", width: "1%" },
          { accessor: "source", width: "1%" },
          { accessor: "model", width: "1%" },
          { accessor: "input", width: 100, render: render.input, ellipsis: true },
          { accessor: "output", width: 100, ellipsis: true },
        ]}
        page={page}
        records={records}
        recordsPerPage={PER_PAGE}
        totalRecords={data?.totalItems ?? 0}
        highlightOnHover
        striped
        withBorder
        withColumnBorders
        onPageChange={setPage}
      />
    </Stack>
  );
};
