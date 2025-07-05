import axios from "axios";
import { getToken, clearToken } from "@/protection/auth/tokenManager";
import { getProtectionHeaders } from "@/protection/auth/requestManager";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
  withCredentials: false,
});

apiClient.interceptors.request.use(async (cfg) => {
  if (cfg.useSecrets) {
    const protectionHeaders = getProtectionHeaders({
      method: cfg.method || "get",
      url: new URL(cfg.url, cfg.baseURL),
    });

    cfg.headers = {
      ...(cfg.headers || {}),
      ...(protectionHeaders || {})
    };
    

    delete cfg.useSecrets;
  }

  return cfg;
});

apiClient.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    let status_code = error.response?.status;
    if (status_code >= 400 && status_code < 500 && !error.config._retry) {
      error.config._retry = true;
      clearToken();
      await getToken({ depends: true });
      return apiClient(error.config);
    }
    return Promise.reject(error);
  }
);
