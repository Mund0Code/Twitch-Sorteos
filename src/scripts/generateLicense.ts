import crypto from "crypto";

function genPart(len = 4) {
  return crypto.randomBytes(len).toString("hex").slice(0, 4).toUpperCase();
}

function generateKey() {
  return `TS-${genPart()}-${genPart()}-PRO`;
}

console.log(generateKey());
