from io import BytesIO
from PIL import Image
from config import gemini_client
from flask import Blueprint, request, jsonify

analyze_image_bp = Blueprint('analyze_image_bp', __name__)

@analyze_image_bp.route('/analyze_image', methods=['POST'])
def analyze_image():
    if 'image' not in request.files:
        return jsonify({
            'error': 'No image provided'
        }), 400
    
    image_file = request.files['image']
    
    if image_file.filename == '':
        return jsonify({'error': 'No image selected'}), 400
    
    try:
        # Load image in
        image_bytes = image_file.read()
        image_data = BytesIO(image_bytes)
        image = Image.open(image_data)
        
        # Gemini prompting
        prompt = """
            What does the text present in this image?
        """
        response = gemini_client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[prompt, image]
        )
        
        # TODO: Change json structure
        return jsonify({
            'result': response.text
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': f'Error processing image: {str(e)}'
        }), 500