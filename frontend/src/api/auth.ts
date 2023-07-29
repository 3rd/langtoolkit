import { Record, RecordAuthResponse } from "pocketbase";
import { User } from "@/types";
import { pb } from "./client";

const authStore = pb.authStore;

const login = (username: string, password: string) => {
  return pb.collection("users").authWithPassword(username, password);
};

const logout = () => {
  return authStore.clear();
};

const refresh = async () => {
  try {
    if (!authStore.isValid) return;
    return await pb.collection("users").authRefresh();
  } catch {
    authStore.clear();
  }
};

const getUser = (authResponse?: RecordAuthResponse<Record>): User | null => {
  if (!authStore.isValid || !authStore.model) return null;

  const model = authResponse?.record ?? authStore.model;
  return {
    id: model.id,
    email: model.email,
    name: model.name,
    username: model.username,
    avatar: model.avatar ? `/api/api/files/_pb_users_auth_/${model.id}/${model.avatar}` : null,
    role: model.role,
  };
};

export { login, logout, refresh, getUser, authStore };
