import threading
from http_server import start_http_server
from socket_server import start_socket_server
from database import init_db

if __name__ == "__main__":
    init_db()
    threading.Thread(target=start_socket_server, daemon=True).start()
    start_http_server()
