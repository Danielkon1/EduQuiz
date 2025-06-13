import socket
import threading
from db.mongoDB import MongoDB
from utilities.utils import uri, db_name, users_collection_name, quizzes_collection_name, port, address, score_multiplier
from utilities.http_utils import create_options_response, create_success_response, create_not_found_response, create_login_failed_response, create_bad_json_response, create_json_success_response, create_server_error_response, create_signup_failed_response
import json
from utilities.crypto_utils import decrypt_aes_gcm
from urllib.parse import parse_qs
import ssl


database = MongoDB(uri, db_name, users_collection_name, quizzes_collection_name, score_multiplier)

def receive_full_http_message(client_socket):
    data = b""

    # Step 1: Read until we reach end of headers
    while b"\r\n\r\n" not in data:
        chunk = client_socket.recv(1024)
        if not chunk:
            break
        data += chunk

    # Step 2: Split headers and remainder
    if b"\r\n\r\n" not in data:
        return data.decode(errors="ignore")  # incomplete headers, return what we got

    headers_part, rest = data.split(b"\r\n\r\n", 1)

    # Step 3: Extract Content-Length
    headers_str = headers_part.decode()
    content_length = 0
    for line in headers_str.split("\r\n"):
        if line.lower().startswith("content-length:"):
            content_length = int(line.split(":")[1].strip())
            break

    # Step 4: Read body until it's complete
    body = rest
    while len(body) < content_length:
        chunk = client_socket.recv(1024)
        if not chunk:
            break
        body += chunk

    # Step 5: Combine headers + separator + body
    full_message = headers_part + b"\r\n\r\n" + body
    return full_message.decode(errors="ignore")

def handle_http_client(client_socket: socket.socket, client_address):
    request = receive_full_http_message(client_socket=client_socket)

    print("----------------------------------------------------------------\n" \
        f"received HTTP request from {client_address}\n\n" \
        f"{request}\n\n" \
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
                        http_response = create_signup_failed_response("User already exists")
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
                    first_answer = data.get("firstAnswer")
                    

                    database.start_game(quiz_name, username, first_answer)

                    http_response = create_success_response("")
                
                elif path.startswith("/next_question"):
                    quiz_name = data.get("quizName")
                    username = data.get("username")
                    current_answer = data.get("currentAnswer")
                    print("first answer is--------", current_answer)
                    print("type of first answer is--------", type(current_answer))
                    database.next_question(quiz_name, username, current_answer)

                    http_response = create_success_response("")
                
                elif path.startswith("/answer_question"):
                    gameCode = data.get("gameCode")
                    answer = data.get("current_answer")

                    http_response = create_success_response(database.submit_answer(gameCode, answer))
                
                elif path.startswith("/submit_results"):
                    game_code = data.get("gameCode")
                    score = data.get("score")
                    name = data.get("name")

                    http_response = create_success_response(database.submit_results(game_code, score, name))
                
                elif path.startswith("/add_quiz"):
                    name = data.get("name")
                    content = data.get("content")
                    username = data.get("username")

                    print(content)
                    print(type(content))

                    http_response = create_success_response(str(database.add_quiz(name, content, username)))

                
                else:
                    http_response = create_not_found_response()

            except Exception as e:
                print(f"error during POST: {e}")
                http_response = create_server_error_response()
        
        case "GET":
            try:
                query_params = {}
                if "?" in path:
                    query_string = path.split("?", 1)[1]
                    parsed = parse_qs(query_string)

                try:
                    encrypted_query = {
                    "iv": json.loads(parsed["iv"][0]),
                    "encrypted": json.loads(parsed["encrypted"][0])
                    }
                
                    decrypted_query = decrypt_aes_gcm(encrypted_query)
                    
                    pairs = decrypted_query.split("&")
                    for pair in pairs:
                        if "=" in pair:
                            key, value = pair.split("=", 1)
                            query_params[key] = value

                except Exception as e:
                    print("Failed to process encrypted GET params:", e)

                
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

                elif path.startswith("/fetch_results"):
                    print("entered game code")
                    game_code = query_params.get("gameCode")

                    http_response = create_success_response(database.fetch_results(game_code))
                
                else:
                    http_response = create_not_found_response()
                

            except Exception as e:
                print(f"error during GET: {e}")
                http_response = create_bad_json_response()

    return http_response
        



def main():
    raw_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    raw_socket.bind((address, port))
    raw_socket.listen()
    print(f"Server running on port {port}")

    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain(certfile='cert.pem', keyfile='key.pem')
    secure_socket = context.wrap_socket(raw_socket, server_side=True)

    while True:
        client_socket, client_address = secure_socket.accept()
        threading.Thread(target=handle_http_client, args=(client_socket, client_address), daemon=True).start()

if __name__ == "__main__":
    main()
