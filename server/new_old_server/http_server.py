import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from database import get_user, add_user
from werkzeug.security import check_password_hash
from config import HOST, PORT

class RequestHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)

        if self.path == '/login':
            self.handle_login(data)
        elif self.path == '/signup':
            self.handle_signup(data)

    def handle_login(self, data):
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            self._set_headers(400)
            self.wfile.write(json.dumps({"status": "failure", "message": "Username and password required."}).encode())
            return

        result = get_user(username)

        if result and check_password_hash(result[0], password):
            self._set_headers(200)
            self.wfile.write(json.dumps({"status": "success", "message": "Login successful!"}).encode())
        else:
            self._set_headers(401)
            self.wfile.write(json.dumps({"status": "failure", "message": "Invalid credentials!"}).encode())

    def handle_signup(self, data):
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            self._set_headers(400)
            self.wfile.write(json.dumps({"status": "failure", "message": "Username and password required."}).encode())
            return

        success, message = add_user(username, password)

        if success:
            self._set_headers(201)
        else:
            self._set_headers(409 if "exists" in message else 500)
        self.wfile.write(json.dumps({"status": "failure" if not success else "success", "message": message}).encode())

def start_http_server():
    httpd = HTTPServer((HOST, PORT), RequestHandler)
    print(f"HTTP server running on port {PORT}")
    httpd.serve_forever()
