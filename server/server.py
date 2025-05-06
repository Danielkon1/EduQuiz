import socket
import threading
from db.mongoDB import MongoDB
from utils import uri, db_name, users_collection_name, quizzes_collection_name, port
from http_utils import create_options_response, create_success_response, create_not_found_response, create_login_failed_response, create_bad_json_response, create_json_success_response
import json

database = MongoDB(uri, db_name, users_collection_name, quizzes_collection_name)
active_quizzes = []

def handle_http_client(client_socket: socket.socket, client_address):
    request = client_socket.recv(1024).decode()
    print(f"\n\nHTTP request from {client_address}:\n{request}\n\n")

    lines = request.split("\r\n")
    if not lines or len(lines[0].split()) < 3:
        client_socket.close()
        return

    method, path, _ = lines[0].split()

    print("----------------------", method, ".........", path)

    if method == "OPTIONS":
        http_response = create_options_response()
        client_socket.send(http_response.encode())
        client_socket.close()
        return
    
    elif method == "POST" and path.startswith("/start_quiz"):
        body = request.split("\r\n\r\n", 1)[1]
        try:
            data = json.loads(body)
            quizName = data.get("quizName")
            username = data.get("username")

            code, content = database.create_game(username, quizName)
            active_quizzes.append(code)
            json_response = json.loads(content)
            json_response.insert(0, {"code": code })

            http_response = create_json_success_response(json.dumps(json_response))
        except:
            http_response = create_bad_json_response()


    
    elif method == "GET" and path.startswith("/quiz_list"):
        try:
            query_string = path.split("?", 1)[1] if "?" in path else ""
            query_params = dict(param.split("=") for param in query_string.split("&") if "=" in param)
            username = query_params.get("username")

            if not username:
                http_response = create_bad_json_response()
            else:
                quizzes = database.get_list_of_quizzes(username)
                http_response = create_json_success_response(json.dumps(quizzes))
        except Exception as e:
            print(f"Error in /quiz_list GET: {e}")
            http_response = create_bad_json_response()


    elif method == "POST" and path == "/add_user":
        body = request.split("\r\n\r\n", 1)[1]
        try:
            data = json.loads(body)
            username = data.get("username")
            password = data.get("password")
            
            insertion_result = database.insert_user(username, password)
            
            if insertion_result == "username already in database":
                http_response = create_login_failed_response("username already exists")
            else:
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
