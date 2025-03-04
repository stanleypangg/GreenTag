import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

from google import genai

load_dotenv()
app = Flask(__name__)
CORS(app)

gemini_api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=gemini_api_key)

@app.route('/')
def home():
    return jsonify({"message": "Hello from Flask!"})

# response = client.models.generate_content(
#     model="gemini-2.0-flash", contents="Explain how AI works"
# )
# print(response.text)

if __name__ == '__main__':
    app.run(debug=True, port=3000)