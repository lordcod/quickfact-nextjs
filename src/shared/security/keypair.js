"use client";
import { openDB } from "idb";

async function loadOrCreate() {
  if (typeof window === undefined) return;
  
  const db = await openDB("dpop-db", 1, {
    upgrade(db) {
      db.createObjectStore("keys");
    },
  });

  const stored = await db.get("keys", "dpop");
  if (stored) {
    return {
      publicKey: await crypto.subtle.importKey(
        "jwk",
        stored.publicJwk,
        { name: "ECDSA", namedCurve: "P-256" },
        true,
        ["verify"]
      ),
      privateKey: await crypto.subtle.importKey(
        "jwk",
        stored.privateJwk,
        { name: "ECDSA", namedCurve: "P-256" },
        false,
        ["sign"]
      ),
    };
  }

  const kp = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"]
  );

  const [pub, priv] = await Promise.all([
    crypto.subtle.exportKey("jwk", kp.publicKey),
    crypto.subtle.exportKey("jwk", kp.privateKey),
  ]);
  await db.put("keys", { publicJwk: pub, privateJwk: priv }, "dpop");

  return kp;
}

export const keypair = loadOrCreate();
