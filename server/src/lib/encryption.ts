import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ENCRYPTION_KEY: string = process.env.ENCRYPTION_KEY || ""; // Must be 256 bits (32 characters)
const IV_LENGTH: number = 16; // For AES, this is always 16
const ID_INFO_HASH:string = process.env.INFO_ID || "";
/**
 * Will generate valid encryption keys for use
 * Not used in the code below, but generate one and store it in ENV for your own purposes
 */ 
export function keyGen() {
  return randomBytes(32).toString("hex");
}

/**
 * Encrypt a string
 * Uses a random IV + encryption key for unique encrypted end result
 */
export function encrypt(plainText: string, encryptionKey: string = ENCRYPTION_KEY): string {
  const iv = randomBytes(IV_LENGTH); // Directly use Buffer returned by randomBytes
  const cipher = createCipheriv("aes-256-cbc", Buffer.from(encryptionKey, "hex"), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);

  // Return iv and encrypted data as hex, combined in one line
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

/**
 * Decrypt a string
 */
export function decrypt(text: string, encryptionKey: string = ENCRYPTION_KEY): string {
  const [ivHex, encryptedHex] = text.split(":");
  if (!ivHex || !encryptedHex) {
    throw new Error("Invalid or corrupted cipher format");
  }

  const encryptedText = Buffer.from(encryptedHex, "hex");
  const decipher = createDecipheriv("aes-256-cbc", Buffer.from(encryptionKey, "hex"), Buffer.from(ivHex, "hex"));
  let decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);

  return decrypted.toString();
}


const ALGORITHM = "aes-256-gcm";
const KEY = Buffer.from(ENCRYPTION_KEY, "hex");

export function encryptCustomerLink(data:any) {
  const iv = randomBytes(12);

  const cipher = createCipheriv(ALGORITHM, KEY, iv);

  const plaintext = JSON.stringify(ID_INFO_HASH+data);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return [
    iv.toString("base64url"),
    authTag.toString("base64url"),
    encrypted.toString("base64url"),
  ].join(".");
}

export function decryptCustomerLink(token:string) {
  const [ivEncoded, authTagEncoded, encryptedEncoded] =
    token.split(".");

  const iv = Buffer.from(ivEncoded, "base64url");
  const authTag = Buffer.from(authTagEncoded, "base64url");
  const encrypted = Buffer.from(encryptedEncoded, "base64url");

  const decipher = createDecipheriv(ALGORITHM, KEY, iv);

  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return JSON.parse(decrypted.toString("utf8").replace(ID_INFO_HASH, '').trim());
}
