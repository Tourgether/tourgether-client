import { set, get, del } from "idb-keyval";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export async function saveTokens(accessToken: string, refreshToken: string) {
  await set(ACCESS_TOKEN_KEY, accessToken);
  await set(REFRESH_TOKEN_KEY, refreshToken);
}

export async function getAccessToken() {
  return get(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken() {
  return get(REFRESH_TOKEN_KEY);
}

export async function clearTokens() {
  await del(ACCESS_TOKEN_KEY);
  await del(REFRESH_TOKEN_KEY);
}
