import axios from "axios";
import { getFingerprint } from "@/protection/integrity/fingerprint";   
import { generateDpopToken } from "@/protection/integrity/dpop";       
import { keypair } from "@/protection/integrity/keypair";             
import { getPoW } from "@/protection/integrity/pow";                  
import { apiClient } from "@/api/apiClient";



export async function obtainToken() {
  const fp = await getFingerprint();

  // 1. challenge
  const { data: challenge } = await apiClient.get('/auth/challenge', {
    headers: { "X-FP": fp },
  });

  // 2. PoW
  const { nonce } = await getPoW({
    serverNonce: challenge.server_nonce,
    fingerprint: fp,
    pow_bits: challenge.pow_bits,
  });

  // 3. DPoP для /auth/token
  const dpop = await generateDpopToken({
    htm: "POST",
    htu: `${process.env.NEXT_PUBLIC_API_BASE}/auth/token`,
  });

  // 6. JWK‑публичный
  const { publicKey } = await keypair;
  const { exportJWK } = await import("jose");
  const publicJwk = await exportJWK(publicKey);

  // 6. issue token
  const { data } = await apiClient.post(
    '/auth/token',
    {
      server_nonce: challenge.server_nonce,
      nonce: nonce.toString(),
      fingerprint: fp,
      dpop,
      jwk: publicJwk,
      turnstile: null,
    },
    { headers: { "X-FP": fp } }
  );

  return data.token;
}
