"""
    This file contains necessary functions to handle encryption/decryption of data.
"""
import json
import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from utilities.utils import ENCRYPTION_KEY


# decrypts data sent from client
def decrypt_aes_gcm(encrypted_data: dict):
    try:
        iv = bytes(encrypted_data["iv"])
        ciphertext = bytes(encrypted_data["encrypted"])

        aesgcm = AESGCM(ENCRYPTION_KEY)
        decrypted = aesgcm.decrypt(iv, ciphertext, None)

        return json.loads(decrypted.decode("utf-8"))
    except Exception as e:
        print("Decryption failed:", e)
        raise ValueError("Failed to decrypt data")

# encrypts data to send to client
def encrypt_aes_gcm(data: dict):
    try:
        plaintext = json.dumps(data).encode("utf-8")

        iv = os.urandom(12)

        aesgcm = AESGCM(ENCRYPTION_KEY)
        ciphertext = aesgcm.encrypt(iv, plaintext, None)

        return {
            "iv": list(iv),
            "encrypted": list(ciphertext)
        }
    except Exception as e:
        print("Encryption failed:", e)
        raise ValueError("Failed to encrypt data")