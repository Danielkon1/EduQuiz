"""
    This file contains all http responses that the server sends to the client.
    Each function receives the message body and adds it, encrypted, to the full response.
"""
import json
from utilities.crypto_utils import encrypt_aes_gcm

def encrypt_response(data: str):
    encrypted = encrypt_aes_gcm(data)
    return json.dumps(encrypted)

def create_options_response():
    return (
        "HTTP/1.1 204 No Content\r\n"
        "Access-Control-Allow-Origin: *\r\n"
        "Access-Control-Allow-Methods: POST, GET, OPTIONS\r\n"
        "Access-Control-Allow-Headers: Content-Type\r\n"
        "Content-Length: 0\r\n"
        "\r\n"
    )

def create_success_response(response_body: str):
    encrypted_response = encrypt_response(response_body)
    return (
        "HTTP/1.1 200 OK\r\n"
        "Content-Type: text/plain\r\n"
        "Access-Control-Allow-Origin: *\r\n"
        f"Content-Length: {len(encrypted_response)}\r\n"
        "\r\n"
        f"{encrypted_response}"
    )
def create_json_success_response(response_body: str):
    encrypted_response = encrypt_response(response_body)
    return (
        "HTTP/1.1 200 OK\r\n"
        "Content-Type: application/json\r\n"
        "Access-Control-Allow-Origin: *\r\n"
        f"Content-Length: {len(encrypted_response)}\r\n"
        "\r\n"
        f"{encrypted_response}"
    )

def create_login_failed_response(response_body: str):
    encrypted_response = encrypt_response(response_body)
    return (
        "HTTP/1.1 401 Unauthorized\r\n"
        "Content-Type: text/plain\r\n"
        "Access-Control-Allow-Origin: *\r\n"
        f"Content-Length: {len(encrypted_response)}\r\n"
        "\r\n"
        f"{encrypted_response}"
    )

def create_signup_failed_response(response_body: str):
    encrypted_response = encrypt_response(response_body)
    return (
        "HTTP/1.1 409 Conflict\r\n"
        "Content-Type: text/plain\r\n"
        "Access-Control-Allow-Origin: *\r\n"
        f"Content-Length: {len(encrypted_response)}\r\n"
        "\r\n"
        f"{encrypted_response}"
    )

def create_not_found_response():
    encrypted_response = encrypt_response("Not Found :(")
    return (
        "HTTP/1.1 404 Not Found\r\n"
        "Content-Type: text/plain\r\n"
        "Access-Control-Allow-Origin: *\r\n"
        f"Content-Length: {len(encrypted_response)}\r\n"
        "\r\n"
        f"{encrypted_response}"
    )

def create_bad_json_response():
    encrypted_response = encrypt_response("Invalid JSON data")
    return (
        "HTTP/1.1 422 Unprocessable Entity\r\n"
        "Content-Type: text/plain\r\n"
        "Access-Control-Allow-Origin: *\r\n"
        f"Content-Length: {len(encrypted_response)}\r\n"
        "\r\n"
        f"{encrypted_response}"
    )

def create_server_error_response(body: str):
    encrypted_response = encrypt_response(body)
    return (
        "HTTP/1.1 500 Internal Server Error\r\n"
        "Content-Type: text/plain\r\n"
        "Access-Control-Allow-Origin: *\r\n"
        f"Content-Length: {len(encrypted_response)}\r\n"
        "\r\n"
        f"{encrypted_response}"
    )