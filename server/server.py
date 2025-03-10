from flask import Flask, jsonify
from flask_cors import CORS
from config import db
from ai import ai_bp
from db import db_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(ai_bp)
app.register_blueprint(db_bp)

@app.route("/")
def home():
    return jsonify({
        "message": "Backend server running!"
    })

if __name__ == "__main__":
    # debug=True for development mode
    app.run(debug=True, port=8080)