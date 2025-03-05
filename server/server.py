import os
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS
from google import genai

load_dotenv() # Load environment variables
app = Flask(__name__)
CORS(app) # Allows cross-origin requests

# Gemini Client
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)

# Initialize Firebase
FIREBASE_CREDENTIALS_PATH = os.environ.get("FIREBASE_CREDENTIALS_PATH")
cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
firebase_admin.initialize_app(cred)
db = firestore.client()

# Route: /
# Landing page
@app.route("/")
def home():
    return jsonify({
        "message": "Backend server running!"
    })

# Scan tag
@app.route("/scan-tag")
def analyze_image():
    pass

if __name__ == "__main__":
    # debug=True for development mode
    app.run(debug=True, port=8080)