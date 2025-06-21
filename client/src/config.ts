// Secret key for AES encryptio
export const ENCRYPTION_SECRET_CODE = "2200333911532491";

// Server address
export const SERVER_URL = "https://172.20.10.5:4443";

const textEncoder = new TextEncoder();
export const textDecoder = new TextDecoder();

// Generate and return a CryptoKey object using AES-GCM and the secret code
export const getKey = async () => {
  const rawKey = textEncoder.encode(ENCRYPTION_SECRET_CODE);
  return await window.crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
};

// Encrypt a JavaScript object using AES-GCM
export const encryptData = async (data: any) => {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // Generate a 12-byte IV
  const key = await getKey();
  const encodedData = textEncoder.encode(JSON.stringify(data));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encodedData
  );

  // Return IV and encrypted data as arrays for transport/storage
  return {
    iv: Array.from(iv),
    encrypted: Array.from(new Uint8Array(encrypted)),
  };
};

// Decrypt AES-GCM encrypted data back to original object
export const decryptData = async (encryptedData: {
  iv: number[];
  encrypted: number[];
}) => {
  const iv = new Uint8Array(encryptedData.iv);
  const ciphertext = new Uint8Array(encryptedData.encrypted);
  const key = await getKey();

  try {
    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      ciphertext
    );

    const decodedText = textDecoder.decode(decrypted);
    return JSON.parse(decodedText); // Convert decrypted text back to object
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt server response");
  }
};

// Hash a password using SHA-256 and return it as a hex string
export const sha256 = async (password: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};
