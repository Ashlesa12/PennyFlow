import api from "./client";
import type { ChangePassword, User, UserPreferences } from "../types";

export interface ProfileUpdate {
  name?: string;
  avatar_url?: string | null;
}

export async function fetchMe(): Promise<User> {
  const res = await api.get<User>("/users/me");
  return res.data;
}

export async function updateProfile(data: ProfileUpdate): Promise<User> {
  const res = await api.put<User>("/users/me", data);
  return res.data;
}

export async function updatePreferences(data: UserPreferences): Promise<User> {
  const res = await api.put<User>("/users/me/preferences", data);
  return res.data;
}

export async function changePassword(data: ChangePassword): Promise<void> {
  await api.put("/users/me/change-password", data);
}

export async function deleteAccount(): Promise<void> {
  await api.delete("/users/me");
}
