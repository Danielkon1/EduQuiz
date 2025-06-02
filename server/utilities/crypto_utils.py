import json
import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from utilities.utils import encryption_key

    
def decrypt_aes_gcm(encrypted_data: dict):
    try:
        iv = bytes(encrypted_data["iv"])
        ciphertext = bytes(encrypted_data["encrypted"])

        aesgcm = AESGCM(encryption_key)
        decrypted = aesgcm.decrypt(iv, ciphertext, None)

        return json.loads(decrypted.decode("utf-8"))
    except Exception as e:
        print("Decryption failed:", e)
        raise ValueError("Failed to decrypt data")

def encrypt_aes_gcm(data: dict):
    try:
        plaintext = json.dumps(data).encode("utf-8")

        iv = os.urandom(12)

        aesgcm = AESGCM(encryption_key)
        ciphertext = aesgcm.encrypt(iv, plaintext, None)

        return {
            "iv": list(iv),
            "encrypted": list(ciphertext)
        }
    except Exception as e:
        print("Encryption failed:", e)
        raise ValueError("Failed to encrypt data")