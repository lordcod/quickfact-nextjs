import { obtainToken } from "./authFlow";

const TOKEN_KEY = "x-secrets";

async function setCookie(name, value, maxAgeSec) {
  await cookieStore.set({
    name,
    value,
    maxAge: maxAgeSec,
    path: "/",
    secure: true,
    sameSite: "lax",
  });
}

async function getCookie(name) {
  const cookie = await cookieStore.get(name);
  return cookie?.value || null;
}

async function deleteCookie(name) {
  await cookieStore.delete(name);
}

function decodeJwtExp(token) {
  try {
    const [, payload] = token.split(".");
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json).exp;
  } catch {
    return 0;
  }
}

function isValid(tokenData) {
  if (!tokenData) return false;
  return Date.now() / 1000 < tokenData.exp - 5;
}

async function saveToken(token) {
  const exp = decodeJwtExp(token);
  const maxAge = exp - Math.floor(Date.now() / 1000) - 5;
  if (maxAge > 0) {
    await setCookie(TOKEN_KEY, token, maxAge);
  }
}

async function loadToken() {
  const token = await getCookie(TOKEN_KEY);
  if (!token) return null;
  const exp = decodeJwtExp(token);
  return { token, exp };
}

let inflight = null;

export async function getToken({ depends = false } = {}) {
  let tokenData = await loadToken();

  if (isValid(tokenData)) return tokenData;

  if (inflight) return inflight;

  inflight = (async () => {
    const token = await obtainToken();
    await saveToken(token);
    inflight = null;
    return await loadToken();
  })();

  if (depends) {
    return await inflight
  }
  return inflight;
}

export async function clearToken() {
  await deleteCookie(TOKEN_KEY);
}
