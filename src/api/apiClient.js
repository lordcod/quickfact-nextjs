import axios from "axios";
import { getToken, clearToken } from "@/shared/auth/tokenManager";
import { getFingerprint } from "@/shared/security/fingerprint";
import { generateDpopToken } from "@/shared/security/dpop";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
  withCredentials: false,
});

apiClient.interceptors.request.use(async (cfg) => {
  if (cfg.useSecrets) {
    const { token } = await getToken();
    const fp = await getFingerprint();

    const dpop = await generateDpopToken({
      htm: (cfg.method || "get").toUpperCase(),
      htu: new URL(cfg.url, cfg.baseURL).toString(),
    });

    cfg.headers = {
      ...(cfg.headers || {}),
      "X-Page-Token": token,
      DPoP: dpop,
      "X-FP": fp,
    };

    delete cfg.useSecrets;
  }

  return cfg;
});

apiClient.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    let status_code = error.response?.status
    if (status_code >= 400 && status_code < 500 && !error.config._retry) {
      error.config._retry = true;
      clearToken();
      await getToken({depends: true});
      return apiClient(error.config);
    }
    return Promise.reject(error);
  }
);
