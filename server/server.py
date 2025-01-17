from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)
CORS(app)  # Allow requests from other origins

VALID_USERNAME = "admin"
VALID_PASSWORD = "password123"

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"status": "failure", "message": "Username and password are required."}), 400

    conn = sqlite3.connect('./server/users.db')
    cursor = conn.cursor()
    cursor.execute("SELECT password_hash FROM users WHERE username = ?", (username,))
    result = cursor.fetchone()
    conn.close()

    if result and check_password_hash(result[0], password):
        return jsonify({"status": "success", "message": "Login successful!"}), 200
    else:
        return jsonify({"status": "failure", "message": "Invalid credentials!"}), 401




@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"status": "failure", "message": "Username and password are required."}), 400

    password_hash = generate_password_hash(password)

    try:
        conn = sqlite3.connect('./server/users.db')
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", (username, password_hash))
        conn.commit()
        conn.close()
        return jsonify({"status": "success", "message": "User registered successfully."}), 201
    except sqlite3.IntegrityError:
        return jsonify({"status": "failure", "message": "Username already exists."}), 409
    except Exception as e:
        return jsonify({"status": "failure", "message": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)