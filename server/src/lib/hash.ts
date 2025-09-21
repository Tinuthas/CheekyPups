import crypto from "crypto"

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex")

  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString('hex')

  return { hash, salt };
}

export function verifyPassword({possiblePassword, salt, hash}: {possiblePassword: string, salt: string, hash: string}) {
  const possibleHash = crypto.pbkdf2Sync(possiblePassword, salt, 1000, 64, "sha512").toString('hex')
  return possibleHash === hash
}