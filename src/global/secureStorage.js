const SECURE_KEY = "v1g0_s3cur3_k3y_2024";

function xorEncrypt(text, key) {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(
      text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return result;
}

export function setSecureItem(key, value) {
  try {
    const str = typeof value === "string" ? value : JSON.stringify(value);
    const encrypted = btoa(xorEncrypt(str, SECURE_KEY));
    localStorage.setItem(key, encrypted);
  } catch (e) {
    console.error("secureStorage set error:", e);
  }
}

export function getSecureItem(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const decrypted = xorEncrypt(atob(raw), SECURE_KEY);
    return JSON.parse(decrypted);
  } catch (e) {
    // Fallback: if old unencrypted data exists, read it and re-save encrypted
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      setSecureItem(key, parsed);
      return parsed;
    } catch (e2) {
      localStorage.removeItem(key);
      return null;
    }
  }
}

export function removeSecureItem(key) {
  localStorage.removeItem(key);
}
