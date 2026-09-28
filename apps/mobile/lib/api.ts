import * as SecureStore from "expo-secure-store";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000";
const TOKEN_KEY = "cricksync.auth.token";

export async function setToken(token: string) { await SecureStore.setItemAsync(TOKEN_KEY, token); }
export async function getToken() { return SecureStore.getItemAsync(TOKEN_KEY); }
export async function clearToken() { await SecureStore.deleteItemAsync(TOKEN_KEY); }

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", "Bearer " + token);
  const response = await fetch(API_URL + path, { ...options, headers });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Request failed");
  return body as T;
}