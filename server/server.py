from http.server import HTTPServer, SimpleHTTPRequestHandler
import ssl
from utils import address, port


server_address = (address, port)

httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)

context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain(certfile='server.pem')

httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

print("Serving on https://localhost:4443")
httpd.serve_forever()