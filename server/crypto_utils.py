import json
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from utils import encryption_key

def decrypt_aes_gcm(encrypted_data: dict) -> dict:
    try:
        # Correctly convert lists to bytes
        iv = bytes(encrypted_data["iv"])  # must be bytes
        ciphertext = bytes(encrypted_data["encrypted"])

        aesgcm = AESGCM(encryption_key)
        decrypted = aesgcm.decrypt(iv, ciphertext, None)  # None = no AAD

        return json.loads(decrypted.decode("utf-8"))
    except Exception as e:
        print("Decryption failed:", e)
        raise ValueError("Failed to decrypt data")

