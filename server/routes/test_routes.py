from flask import Blueprint, jsonify
from firebase_admin import firestore

# Create a Blueprint for test routes
test_bp = Blueprint('test', __name__)

# Initialize db as None (will be set later)
db = None

# Function to initialize the Blueprint with dependencies
def init_blueprint(firestore_db):
    global db
    db = firestore_db
    return test_bp

# Route: Test Firebase connection
@test_bp.route("/test-firebase")
def test_firebase():
    try:
        # Write data to Firestore
        test_ref = db.collection('test').document('test-doc')
        test_ref.set({
            'message': 'Firebase connection successful',
            'timestamp': firestore.SERVER_TIMESTAMP
        })
        
        # Read data back
        doc = test_ref.get()
        if doc.exists:
            return jsonify({
                "status": "success",
                "message": "Firebase connection works!",
                "data": doc.to_dict()
            })
        else:
            return jsonify({
                "status": "error", 
                "message": "Document was not created"
            }), 500
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Firebase connection failed: {str(e)}"
        }), 500