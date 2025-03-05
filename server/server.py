from flask import Flask, jsonify
from flask_cors import CORS
from config import db, gemini_client

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({
        "message": "Backend server running!"
    })

# Scan tag
@app.route("/scan-tag")
def analyze_image():
    return jsonify({
        "message": "scan-tag route running!"
    })

if __name__ == "__main__":
    # debug=True for development mode
    app.run(debug=True, port=8080)