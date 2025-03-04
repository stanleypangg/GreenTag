import os
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS
from google import genai

# App Instance
app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv()

# Gemini Client
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)

# /api/home
@app.route("/api/home", methods=['GET'])
def return_home():
    return jsonify({
        'message': 'Hello world!'
    })

if __name__ == "__main__":
    # debug=True for development mode
    app.run(debug=True, port=8080)