import Cookies from "js-cookie";

const TOKEN_KEY = "accessToken";

export function storeAccessToken(token: string) {
  Cookies.set(TOKEN_KEY, token, { expires: 1 }); // 1 day expiry
}

export function getAccessToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

export function removeAccessToken() {
  Cookies.remove(TOKEN_KEY);
}
