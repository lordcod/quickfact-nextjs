const { apiClient } = require("./apiClient");

export function getFact() {
  return apiClient.get("/", {useSecrets: true}).then(response => response.data);
}