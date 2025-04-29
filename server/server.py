import socket
import threading
from db.mongoDB import MongoDB
from utils import uri, db_name, users_collection_name, port
from http_utils import create_options_response, create_success_response, create_not_found_response, create_login_failed_response, create_bad_json_response
import json

database = MongoDB(uri, db_name, users_collection_name)

def handle_http_client(client_socket: socket.socket, client_address):
    request = client_socket.recv(1024).decode()
    print(f"HTTP request from {client_address}:\n{request}")

    lines = request.split("\r\n")
    if not lines or len(lines[0].split()) < 3:
        client_socket.close()
        return

    method, path, _ = lines[0].split()

    if method == "OPTIONS":
        http_response = create_options_response()
        client_socket.send(http_response.encode())
        client_socket.close()
        return

    elif method == "POST" and path == "/add_user":
        body = request.split("\r\n\r\n", 1)[1]
        try:
            data = json.loads(body)
            username = data.get("username")
            password = data.get("password")
            database.insert_user(username, password)
            
            http_response = create_success_response(f"User {username} added!")
        except:
            http_response = create_bad_json_response()



    elif method =="POST" and path == "/login":
        body = request.split("\r\n\r\n", 1)[1]
        try:
            data = json.loads(body)
            username = data.get("username")
            password = data.get("password")
            if database.is_user_in_db(username, password):
                http_response = create_success_response(f"User {username} logged in!")
            else:
                http_response = create_login_failed_response("Username or password incorrect")
        except:
            http_response = create_bad_json_response()

    else:
        http_response = create_not_found_response()
        
    client_socket.send(http_response.encode())
    client_socket.close()

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
