export async function getPoW({ serverNonce, fingerprint, pow_bits }) {
  const prefix = "0".repeat(pow_bits / 4);
  const enc = new TextEncoder();
  let nonce = 0;

  while (true) {
    const str = `${serverNonce}:${nonce}:${fingerprint}`;
    const hashBuf = await crypto.subtle.digest("SHA-256", enc.encode(str));
    const hex = [...new Uint8Array(hashBuf)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (hex.startsWith(prefix)) {
      return { nonce, hash: hex };
    }
    nonce++;
  }
}
