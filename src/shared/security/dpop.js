import { exportJWK, SignJWT } from "jose";
import { keypair } from "./keypair";

export async function generateDpopToken({ htm, htu }) {
  const { publicKey, privateKey } = await keypair;
  const publicJwk = await exportJWK(publicKey);
  const dpopJwt = await new SignJWT({
    htm,
    htu,
    iat: Math.floor(Date.now() / 1000),
  })
    .setProtectedHeader({ alg: "ES256", typ: "dpop+jwt", jwk: publicJwk })
    .sign(privateKey);

  return dpopJwt;
}
