import socket
import threading
from db.mongoDB import MongoDB
from utilities.utils import uri, db_name, users_collection_name, quizzes_collection_name, port
from utilities.http_utils import create_options_response, create_success_response, create_not_found_response, create_login_failed_response, create_bad_json_response, create_json_success_response
import json
from utilities.crypto_utils import decrypt_aes_gcm

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

    response = handle_http_request(method, path, request)

    client_socket.send(response.encode())
    client_socket.close()


def handle_http_request(method: str, path: str, request: str):
    http_response = ""
    match method:
        case "OPTIONS":
            http_response = create_options_response()

        case "POST":
            try:
                body = request.split("\r\n\r\n", 1)[1]

                encrypted_data = json.loads(body)
                data = decrypt_aes_gcm(encrypted_data)

                if path.startswith("/open_quiz"):
                    quiz_name = data.get("quizName")
                    username = data.get("username")

                    code, content = database.create_game_queue(username, quiz_name)
                    json_response = json.loads(content)
                    json_response.insert(0, {"code": code })

                    http_response = create_json_success_response(json.dumps(json_response))
                
                elif path.startswith("/add_user"):
                    username = data.get("username")
                    password = data.get("password")
                    
                    insertion_result = database.insert_user(username, password)
                    
                    if insertion_result == "username already in database":
                        http_response = create_login_failed_response("username already exists")
                    else:
                        http_response = create_success_response(f"User {username} added!")

                elif path.startswith("/login"):
                    username = data.get("username")
                    password = data.get("password")

                    if database.is_user_in_db(username, password):
                        http_response = create_success_response(f"User {username} logged in!")
                    else:
                        http_response = create_login_failed_response("Username or password incorrect")
                
                elif path.startswith("/join_game"):
                    gameCode = data.get("gameCode")

                    http_response = create_success_response(str(database.join_game(gameCode)))
                
                elif path.startswith("/start_game"):
                    quiz_name = data.get("quizName")
                    username = data.get("username")

                    database.start_game(quiz_name, username)

                    http_response = create_success_response("")
                
                elif path.startswith("/next_question"):
                    quiz_name = data.get("quizName")
                    username = data.get("username")

                    database.next_question(quiz_name, username)

                    http_response = create_success_response("")
                
                else:
                    http_response = create_not_found_response()

            except Exception as e:
                print(f"error during POST: {e}")
                http_response = create_bad_json_response()
        
        case "GET":
            try:
                query_params = {}
                if "?" in path:
                    query_string = path.split("?", 1)[1]
                    pairs = query_string.split("&")
                    for pair in pairs:
                        if "=" in pair:
                            key, value = pair.split("=", 1)
                            query_params[key] = value
                
                if path.startswith("/quiz_list"):
                    username = query_params.get("username")

                    if not username:
                        http_response = create_bad_json_response()
                    else:
                        quizzes = database.get_list_of_quizzes(username)
                        http_response = create_json_success_response(json.dumps(quizzes))

                elif path.startswith("/game_status"):
                    code = query_params.get("code")
                    game_status = database.get_game_status(code)
                    if game_status == "not found":
                        http_response = create_not_found_response()
                    else:
                        http_response = create_success_response(game_status)
                
                else:
                    http_response = create_not_found_response()
                

            except Exception as e:
                print(f"error during POST: {e}")
                http_response = create_bad_json_response()

    return http_response
        



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
