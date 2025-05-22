import socket
import threading
from db.mongoDB import MongoDB
from utils import uri, db_name, users_collection_name, quizzes_collection_name, port
from http_utils import create_options_response, create_success_response, create_not_found_response, create_login_failed_response, create_bad_json_response, create_json_success_response
import json
from crypto_utils import decrypt_aes_gcm

database = MongoDB(uri, db_name, users_collection_name, quizzes_collection_name)


def handle_http_client(client_socket: socket.socket, client_address):
    request = client_socket.recv(1024).decode()

    print("----------------------------------------------------------------\n" \
        f"received HTTP request from {client_address}\n" \
        "----------------------------------------------------------------")
    
    lines = request.split("\r\n")

    if not lines or len(lines[0].split()) < 3:
        client_socket.close()
        return
    
    method, path, _ = lines[0].split()

def handle_http_request(method: str, path: str):
    match method:
        case "OPTIONS":
            


def main():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind(("0.0.0.0", port))
    server_socket.listen()
    print(f"Server running on port {port}")

    while True:
        client_socket, client_address = server_socket.accept()
        threading.Thread(target=handle_http_client, args=(client_socket, client_address), daemon=True).start()

if __name__ == "__main__":
    main()
