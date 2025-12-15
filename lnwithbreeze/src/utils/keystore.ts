import CryptoJS from "crypto-js";

// Encrypt mnemonic with password
export function encryptMnemonic(mnemonic: string, password: string) {
  return CryptoJS.AES.encrypt(mnemonic, password).toString();
}

// Decrypt mnemonic
export function decryptMnemonic(cipherText: string, password: string) {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, password);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || null;
  } catch {
    return null;
  }
}
