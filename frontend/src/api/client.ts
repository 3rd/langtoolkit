import PocketBase from "pocketbase";

const pb = new PocketBase("/api");

const createHTTPClient = () => {
  return (path: string, options: RequestInit) => {
    options.headers = Object.assign(options.headers ?? {}, {
      ["Content-Type"]: "application/json",
      Authorization: `${pb.authStore.token}`,
    });
    return fetch(`/api/${path}`, options);
  };
};

const http = createHTTPClient();

export { pb, http };
