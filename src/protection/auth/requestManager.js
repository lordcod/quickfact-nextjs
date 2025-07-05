import { getToken } from "@/protection/auth/tokenManager";
import { getFingerprint } from "@/protection/integrity/fingerprint";
import { generateDpopToken } from "@/protection/integrity/dpop";

export async function getProtectionHeaders({ method, url }) {
  const { token } = await getToken();
  const fp = await getFingerprint();

  const dpop = await generateDpopToken({
    htm: method.toUpperCase(),
    htu: url.toString(),
  });

  return {
    "X-Page-Token": token,
    DPoP: dpop,
    "X-FP": fp,
  };
}
