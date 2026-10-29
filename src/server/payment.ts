import crypto from "node:crypto";

export function hasValidInfinitePaySignature(
  rawBody: Buffer | string,
  suppliedSignature: string,
  secret: string,
): boolean {
  if (!secret || !suppliedSignature) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const supplied = suppliedSignature.trim();
  if (supplied.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(expected));
}

