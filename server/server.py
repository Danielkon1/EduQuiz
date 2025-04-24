import socket
import threading
import time
from mongoDB import MongoDB
from utils import uri, db_name, users_collection_name, port
import json

database = MongoDB(uri, db_name, users_collection_name)

def handle_http_client(client_socket: socket.socket, client_address):
    request = client_socket.recv(1024).decode()
    print(f"HTTP request from {client_address}:\n{request}")

    lines = request.split("\r\n")
    method, path, _ = lines[0].split()

    if method == "POST" and path == "/add_user":
        body = request.split("\r\n\r\n", 1)[1]
        try:
            data = json.loads(body)
            username = data.get("username")
            password = data.get("password")
            database.insert_user(username, password)
            response_body = f"User {username} added!"
        except Exception as e:
            response_body = "Invalid JSON data"

        http_response = (
            "HTTP/1.1 200 OK\r\n"
            "Content-Type: text/plain\r\n"
            f"Content-Length: {len(response_body)}\r\n"
            "\r\n"
            f"{response_body}"
        )
    else:
        http_response = (
            "HTTP/1.1 404 Not Found\r\n"
            "Content-Type: text/plain\r\n"
            "Content-Length: 13\r\n"
            "\r\n"
            "Not Found  :("
        )

    client_socket.send(http_response.encode())
    client_socket.close()

    
    


def main():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind(("0.0.0.0", port))
    server_socket.listen()
    print(f"Server running on port {port}")

    while True:
        client_socket, client_address = server_socket.accept()

        # Peek first few bytes to determine if HTTP or custom
        first_msg = client_socket.recv(4, socket.MSG_PEEK).decode()

        threading.Thread(target=handle_http_client, args=(client_socket, client_address), daemon=True).start()


if __name__ == "__main__":
    main()